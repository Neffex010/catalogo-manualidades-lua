/**
 * catalog.js
 * -----------------------------------------------------------------------------
 * Funciones PURAS de seleccion de datos del catalogo.
 * Al no depender de React ni del servicio, son triviales de testear
 * ( Vitest / Jest ) y se pueden reutilizar en un futuro panel de administracion.
 * -----------------------------------------------------------------------------
 */

import { ALL_CATEGORY, CATEGORIES, SUBCATEGORIES } from '../config/site.js'
import { ALL_COLOR_FAMILY, COLOR_FAMILIES, getColorFamily } from './color.js'
import { normalizeToken } from './format.js'

/** Normaliza texto: minusculas, sin acentos y sin signos, para comparar. */
export function normalizeText(value) {
  return normalizeToken(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extrae las categorias del catalogo con la cantidad de piezas de cada una.
 *
 * Se respeta el ORDEN OFICIAL definido en `CATEGORIES` (Manualidades,
 * Estambres, Hilos) y las 3 categorias aparecen siempre, incluso con count 0,
 * para que el filtro nunca cambie de lugar. Cualquier categoria extra que
 * llegue desde el backend se anade al final, en orden alfabetico.
 *
 * @param {Array<object>} products
 * @returns {Array<{ name: string, label: string, count: number }>}
 */
export function getCategories(products = []) {
  const counter = new Map()

  for (const product of products) {
    const category = product?.category
    if (!category) continue
    counter.set(category, (counter.get(category) ?? 0) + 1)
  }

  const official = CATEGORIES.map(({ name, label }) => ({
    name,
    label,
    count: counter.get(name) ?? 0,
  }))

  // Categorias no contempladas en la configuracion (futuro backend).
  const extras = [...counter.entries()]
    .filter(([name]) => !CATEGORIES.some((category) => category.name === name))
    .map(([name, count]) => ({ name, label: name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))

  return [...official, ...extras]
}

/**
 * Indica si un producto coincide con el texto de busqueda.
 * Busca en nombre, marca, descripcion, categoria, subcategoria, etiquetas y en
 * los datos de cada variante (codigo y nombre de color). Asi "01", "Cielo" o
 * "Kotton" encuentran el estambre o el hilo correspondiente.
 *
 * @param {object} product
 * @param {string} term
 * @returns {boolean}
 */
export function matchesSearch(product, term) {
  const query = normalizeText(term)
  if (!query) return true

  const variantWords = (product?.variants ?? []).flatMap((variant) => [
    variant?.colorCode,
    variant?.colorName,
    variant?.line,
  ])

  const haystack = [
    product?.name,
    product?.brand,
    product?.description,
    product?.category,
    product?.subcategory,
    ...(product?.tags ?? []),
    ...variantWords,
  ]
    .map(normalizeText)
    .join(' ')

  // Todas las palabras deben aparecer (busqueda AND, mas precisa)
  return query.split(' ').every((word) => haystack.includes(word))
}

/**
 * Aplica busqueda + categoria + subcategoria + familia de color sobre el catalogo.
 *
 * @param {Array<object>} products
 * @param {{ search?: string, category?: string, subcategory?: string, colorFamily?: string }} filters
 * @returns {Array<object>}
 */
export function filterProducts(
  products = [],
  {
    search = '',
    category = ALL_CATEGORY,
    subcategory = 'all',
    colorFamily = ALL_COLOR_FAMILY,
  } = {}
) {
  return products.filter((product) => {
    const byCategory = !category || category === ALL_CATEGORY || product.category === category
    const bySubcategory =
      !subcategory || subcategory === 'all' || product.subcategory === subcategory
    const bySearch = matchesSearch(product, search)

    // Solo estambres e hilos tienen variantes; en manualidades el filtro de
    // familia no aplica y no debe vaciar la lista.
    const hasFamilyFilter = colorFamily && colorFamily !== ALL_COLOR_FAMILY
    const byColor =
      !hasFamilyFilter ||
      (product.variants ?? []).some(
        (variant) => getColorFamily(variant?.colorName) === colorFamily
      )

    return byCategory && bySubcategory && bySearch && byColor
  })
}

/**
 * Obtiene las subcategorias con el numero de piezas de cada una.
 * @param {Array<object>} products
 * @returns {Array<{ name: string, label: string, count: number }>}
 */
export function getSubcategories(products = []) {
  const counter = new Map()
  for (const product of products) {
    if (!product?.subcategory) continue
    counter.set(product.subcategory, (counter.get(product.subcategory) ?? 0) + 1)
  }

  return SUBCATEGORIES.map((sub) => ({
    name: sub.name,
    label: sub.label,
    count: counter.get(sub.name) ?? 0,
  })).filter((sub) => sub.count > 0)
}

/**
 * Ordenes disponibles en la barra del catalogo. `relevance` conserva el orden
 * curado (las piezas agotadas al final) que ya aplica `sortProducts`.
 */
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre: A–Z' },
]

/**
 * Precio comparable dentro de los ordenes por precio.
 *
 * Devuelve `null` cuando la pieza no publica precio. Se usa `null` en lugar de
 * un centinela numerico porque `Infinity` invierte el resultado al ordenar de
 * mayor a menor: una pieza a cotizar terminaria primero. El comparador decide
 * el destino de los `null`.
 */
function comparablePrice(product) {
  return Number.isFinite(product?.price) ? product.price : null
}

/**
 * Compara dos productos por precio. Las piezas sin precio publicado van
 * siempre al final, sin importar la direccion del orden.
 *
 * @param {object} a
 * @param {object} b
 * @param {'asc'|'desc'} direction
 * @returns {number}
 */
function comparePrices(a, b, direction) {
  const priceA = comparablePrice(a)
  const priceB = comparablePrice(b)

  if (priceA === null && priceB === null) return 0
  if (priceA === null) return 1
  if (priceB === null) return -1

  return direction === 'desc' ? priceB - priceA : priceA - priceB
}

/**
 * Ordena el resultado ya filtrado.
 *
 * Solo las piezas marcadas como agotadas van al final; un producto sin dato de
 * disponibilidad conserva su lugar. Dentro de cada grupo se aplica el criterio
 * elegido. `Array.prototype.sort` es estable, asi que el orden curado se
 * conserva cuando hay empates.
 *
 * @param {Array<object>} products
 * @param {'relevance'|'price-asc'|'price-desc'|'name'} sort
 * @returns {Array<object>}
 */
export function sortCatalog(products = [], sort = 'relevance') {
  const byAvailability = sortProducts(products)

  // Solo lo marcado como agotado pierde prioridad; lo desconocido no.
  const byAvailabilityThen = (a, b) =>
    (a?.available === false ? 1 : 0) - (b?.available === false ? 1 : 0)

  switch (sort) {
    case 'price-asc':
      return byAvailability.sort((a, b) => {
        const rank = byAvailabilityThen(a, b)
        return rank !== 0 ? rank : comparePrices(a, b, 'asc')
      })
    case 'price-desc':
      return byAvailability.sort((a, b) => {
        const rank = byAvailabilityThen(a, b)
        return rank !== 0 ? rank : comparePrices(a, b, 'desc')
      })
    case 'name':
      return byAvailability.sort((a, b) => {
        const rank = byAvailabilityThen(a, b)
        return rank !== 0 ? rank : String(a.name ?? '').localeCompare(String(b.name ?? ''), 'es')
      })
    default:
      return byAvailability
  }
}

/**
 * Familias de color presentes en el catalogo, con cuantas variantes tiene cada
 * una. Se respeta el orden oficial de `COLOR_FAMILIES` para que los chips no
 * cambien de lugar entre categorias.
 *
 * @param {Array<object>} products
 * @returns {Array<{ id: string, label: string, hint: string, count: number }>}
 */
export function getColorFamilies(products = []) {
  const counter = new Map()

  for (const product of products) {
    for (const variant of product?.variants ?? []) {
      const family = getColorFamily(variant?.colorName)
      counter.set(family, (counter.get(family) ?? 0) + 1)
    }
  }

  return COLOR_FAMILIES.map((family) => ({
    ...family,
    count: counter.get(family.id) ?? 0,
  }))
}

/**
 * Ordena el catalogo: solo las piezas marcadas como agotadas se van al final;
 * el resto conserva el orden curado del origen de datos (catalogo local o API).
 * Un producto sin dato de disponibilidad no se penaliza, porque "no lo se" no
 * es "agotado".
 *
 * @param {Array<object>} products
 * @returns {Array<object>}
 */
export function sortProducts(products = []) {
  const rank = (product) => (product?.available === false ? 1 : 0)
  return [...products].sort((a, b) => rank(a) - rank(b))
}
