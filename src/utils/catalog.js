/**
 * catalog.js
 * -----------------------------------------------------------------------------
 * Funciones PURAS de seleccion de datos del catalogo.
 * Al no depender de React ni del servicio, son triviales de testear
 * ( Vitest / Jest ) y se pueden reutilizar en un futuro panel de administracion.
 * -----------------------------------------------------------------------------
 */

import { ALL_CATEGORY, CATEGORIES } from '../config/site'

/** Normaliza texto: minusculas, sin acentos y sin signos, para comparar. */
export function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extrae las categorias del catalogo con la cantidad de piezas de cada una.
 *
 * Se respeta el ORDEN OFICIAL definido en `CATEGORIES` (Amigurumis, Eventos,
 * Flores, Llaveros) y las 4 categorias aparecen siempre, incluso con count 0,
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
 * Busca en nombre, descripcion, categoria y etiquetas.
 *
 * @param {object} product
 * @param {string} term
 * @returns {boolean}
 */
export function matchesSearch(product, term) {
  const query = normalizeText(term)
  if (!query) return true

  const haystack = [
    product?.name,
    product?.description,
    product?.category,
    ...(product?.tags ?? []),
  ]
    .map(normalizeText)
    .join(' ')

  // Todas las palabras deben aparecer (busqueda AND, mas precisa)
  return query.split(' ').every((word) => haystack.includes(word))
}

/**
 * Aplica busqueda + filtro de categoria sobre el catalogo.
 *
 * @param {Array<object>} products
 * @param {{ search?: string, category?: string }} filters
 * @returns {Array<object>}
 */
export function filterProducts(products = [], { search = '', category = ALL_CATEGORY } = {}) {
  return products.filter((product) => {
    const byCategory = !category || category === ALL_CATEGORY || product.category === category
    const bySearch = matchesSearch(product, search)
    return byCategory && bySearch
  })
}

/**
 * Ordena el catalogo: primero las piezas disponibles y al final las agotadas,
 * respetando el orden curado del origen de datos (JSON o API) dentro de cada
 * grupo. Array.prototype.sort es estable, por lo que no hay que comparar nombres.
 *
 * @param {Array<object>} products
 * @returns {Array<object>}
 */
export function sortProducts(products = []) {
  return [...products].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1
    return 0
  })
}

/**
 * Resumen para el encabezado del catalogo.
 * @param {Array<object>} products
 * @returns {{ total: number, disponibles: number, categorias: number }}
 */
export function getCatalogStats(products = []) {
  return {
    total: products.length,
    disponibles: products.filter((product) => product.available).length,
    categorias: getCategories(products).length,
  }
}
