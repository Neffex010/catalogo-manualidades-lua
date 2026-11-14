/**
 * productService.js
 * -----------------------------------------------------------------------------
 * CAPA DE DATOS DESACOPLADA de la interfaz.
 *
 * Este modulo es la UNICA pieza que la UI conoce para obtener productos. Hoy
 * resuelve los datos desde el catalogo local simulando una llamada asincrona
 * (latencia + errores), pero su contrato esta pensado para una API REST:
 *
 *   getProducts()                 -> GET    {API_BASE_URL}/products
 *   getProductById(id)            -> GET    {API_BASE_URL}/products/{id}
 *   createProduct(payload)        -> POST   {API_BASE_URL}/products
 *   updateProduct(id, payload)    -> PATCH  {API_BASE_URL}/products/{id}
 *   deleteProduct(id)             -> DELETE {API_BASE_URL}/products/{id}
 *
 * MIGRACION A FASTAPI + POSTGRESQL (sin tocar componentes):
 *  1. Define VITE_API_BASE_URL en tu .env  -> la capa HTTP se activa sola.
 *  2. Si el backend no expone alguna mutacion, implementala en el repositorio
 *     `mockRepository` y dejala lista para el siguiente paso.
 *  3. Los componentes siguen importando solo estas funciones.
 * -----------------------------------------------------------------------------
 */

import PRODUCTS from '../data/products'
import imageManifest from '../data/images.json'
import { FALLBACK_IMAGE } from '../config/site'

/* ========================================================================== */
/* Configuracion del modo de acceso a datos                                  */
/* ========================================================================== */

/**
 * Si se define VITE_API_BASE_URL el servicio usa fetch() contra el backend.
 * Si no, usa el repositorio local (comportamiento por defecto).
 */
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL?.replace(/\/$/, '') || null

/**
 * Latencia artificial para que los estados de carga se comporten como en red.
 * Configurable con VITE_MOCK_LATENCY (ver .env.example).
 */
const SIMULATED_LATENCY_MS = Number(import.meta.env?.VITE_MOCK_LATENCY ?? 450)

/** Wrapper de una promesa para simular latencia de red. */
const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/* ========================================================================== */
/* Normalizacion (frontera datos <-> UI)                                     */
/* ========================================================================== */

/**
 * Normaliza una variante de color.
 *
 * Las variantes pueden venir con los nombres del esquema nuevo (`colorCode`,
 * `imageUrl`) o con snake_case desde una API (`color_code`, `image_url`). La
 * UI recibe siempre el mismo modelo, con la imagen ya resuelta contra el
 * manifiesto cuando existe.
 *
 * @param {object} product Producto padre (para el fallback de imagen)
 * @param {object} variant
 * @param {number} index
 * @returns {object|null}
 */
function normalizeVariant(product, variant, index) {
  if (!variant || typeof variant !== 'object') return null

  const imageUrl = variant.imageUrl ?? variant.image_url ?? product.imageUrl ?? FALLBACK_IMAGE
  const image = imageManifest[imageUrl] ?? null
  const rawCode = variant.colorCode ?? variant.color_code ?? ''
  const colorCode = String(rawCode).trim()
  // El stock es opcional: sin dato queda en `null` y la UI invita a confirmar.
  const rawStock = Number(variant.stock)
  const hasStockData =
    variant.stock !== null &&
    variant.stock !== undefined &&
    variant.stock !== '' &&
    Number.isFinite(rawStock)
  const stock = hasStockData ? Math.max(0, rawStock) : null

  return {
    id: String(variant.id ?? `${product.id}-${index}`),
    colorCode: colorCode ? colorCode.padStart(2, '0') : '—',
    colorName: variant.colorName ?? variant.color_name ?? 'Sin nombre',
    hexColor: variant.hexColor ?? variant.hex_color ?? null,
    imageUrl,
    stock,
    // Linea comercial que se deduce del nombre del archivo (KOMFY, KOTTON MILK).
    line: variant.line ?? '',
    imageSrcSetAvif: image?.avif ?? null,
    imageSrcSetWebp: image?.webp ?? null,
    imageLqip: image?.lqip ?? null,
    imageColor: image?.color ?? null,
    imageWidth: image?.width ?? product.width ?? null,
    imageHeight: image?.height ?? product.height ?? null,
  }
}

/**
 * Convierte un registro crudo (JSON local o API) en el modelo que usa la UI.
 * Centralizar esto aqui permite que el backend cambie de nombres de campo
 * (p. ej. `imageUrl`, `precio`, `is_active`) sin romper los componentes.
 *
 * IMAGENES: `src/data/images.json` lo genera `npm run images` y asocia a cada
 * foto local sus variantes (400/600/800 en AVIF y WebP), un placeholder borroso
 * y el color promedio. Si `imageUrl` apunta a un recurso sin entrada en el
 * manifiesto (p. ej. una URL remota del backend), los campos quedan en `null` y
 * la tarjeta cae a un <img> simple con la imagen original.
 *
 * VARIANTES: la disponibilidad se calcula solo cuando hay stock real en alguna
 * variante. Si la tienda no lleva inventario, queda en `null` (sin dato) y la
 * interfaz no muestra "Disponible" ni "Agotado": invita a confirmar por
 * WhatsApp.
 *
 * @param {object} raw
 * @returns {object|null}
 */
function normalizeProduct(raw) {
  if (!raw) return null

  const id = raw.id ?? raw.pk ?? null
  if (id == null) return null

  const variants = Array.isArray(raw.variants)
    ? raw.variants.map((variant, index) => normalizeVariant(raw, variant, index)).filter(Boolean)
    : []

  const rawImage = raw.imageUrl ?? raw.image_url ?? null
  const firstAvailableVariant = variants.find((variant) => variant.stock > 0) ?? variants[0] ?? null
  const imageUrl = rawImage ?? firstAvailableVariant?.imageUrl ?? FALLBACK_IMAGE
  const image = imageManifest[imageUrl] ?? null
  const knownStocks = variants.filter(
    (variant) => typeof variant.stock === 'number' && Number.isFinite(variant.stock)
  )
  const available =
    knownStocks.length > 0
      ? knownStocks.some((variant) => variant.stock > 0)
      : typeof raw.available === 'boolean'
        ? raw.available
        : null

  // El precio es opcional: `null` significa "se cotiza", nunca "$0".
  const rawPrice = raw.price ?? raw.precio
  const numericPrice =
    rawPrice === null || rawPrice === undefined || rawPrice === '' ? null : Number(rawPrice)
  const price = Number.isFinite(numericPrice) ? numericPrice : null

  return {
    id: String(id),
    name: raw.name ?? raw.nombre ?? 'Producto sin nombre',
    brand: raw.brand ?? raw.marca ?? '',
    category: raw.category ?? raw.categoria ?? 'manualidades',
    subcategory: raw.subcategory ?? raw.subcategoria ?? '',
    price,
    description: raw.description ?? raw.descripcion ?? '',
    imageUrl,
    // `srcset` listos para <picture>; null si no hay variantes generadas.
    imageSrcSetAvif: image?.avif ?? firstAvailableVariant?.imageSrcSetAvif ?? null,
    imageSrcSetWebp: image?.webp ?? firstAvailableVariant?.imageSrcSetWebp ?? null,
    // Placeholder de ~0.2 KB y color de fondo para que la tarjeta nunca
    // aparezca en blanco mientras la foto viaja por la red.
    imageLqip: image?.lqip ?? firstAvailableVariant?.imageLqip ?? null,
    imageColor: image?.color ?? firstAvailableVariant?.imageColor ?? null,
    // Proporcion real de la foto; evita que la tarjeta salte de alto al cargar.
    imageWidth: image?.width ?? raw.width ?? raw.ancho ?? firstAvailableVariant?.imageWidth ?? null,
    imageHeight: image?.height ?? raw.height ?? raw.alto ?? firstAvailableVariant?.imageHeight ?? null,
    available,
    variants,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  }
}

/* ========================================================================== */
/* Repositorio local (modo mock)                                             */
/* ========================================================================== */

/**
 * Fuente de datos en memoria. Simula las operaciones CRUD que permitira el
 * backend, de modo que la UI pueda empezar a usar esas funciones desde ya.
 */
const mockRepository = {
  async findAll() {
    await delay()
    return PRODUCTS.map(normalizeProduct).filter(Boolean)
  },

  async findById(id) {
    await delay()
    const found = PRODUCTS.find((product) => String(product.id) === String(id))
    return normalizeProduct(found)
  },
}

/* ========================================================================== */
/* Repositorio HTTP (modo API - futuro backend)                              */
/* ========================================================================== */

const httpRepository = {
  /** GET /products */
  async findAll() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status})`)
    const payload = await response.json()
    // Soporta tanto un array plano como { items: [...] } / { results: [...] }
    const list = Array.isArray(payload) ? payload : (payload.items ?? payload.results ?? [])
    return list.map(normalizeProduct).filter(Boolean)
  },

  /** GET /products/{id} */
  async findById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`No se pudo cargar el producto (${response.status})`)
    return normalizeProduct(await response.json())
  },
}

/** Repositorio activo: API si hay URL configurada, mock en caso contrario. */
const repository = API_BASE_URL ? httpRepository : mockRepository

/** Las mutaciones se conectan aqui cuando el backend exponga el CRUD. */
const notImplemented = (method) =>
  Promise.reject(
    new Error(`${method} no disponible todavía: conecta el backend en productService.js.`)
  )

/* ========================================================================== */
/* API publica del servicio                                                  */
/* ========================================================================== */

/**
 * Obtiene el catalogo completo.
 * @returns {Promise<Array<object>>}
 */
export async function getProducts() {
  return repository.findAll()
}

/**
 * Obtiene un producto por su identificador.
 * @param {number|string} id
 * @returns {Promise<object|null>} null si no existe
 */
export async function getProductById(id) {
  if (id == null || id === '') return null
  return repository.findById(id)
}

/**
 * Crea un producto. (Requiere backend)
 * @param {object} _payload
 * @returns {Promise<object>}
 */
export async function createProduct(_payload) {
  return notImplemented('createProduct')
}

/**
 * Actualiza un producto. (Requiere backend)
 * @param {number|string} _id
 * @param {object} _payload
 * @returns {Promise<object>}
 */
export async function updateProduct(_id, _payload) {
  return notImplemented('updateProduct')
}

/**
 * Elimina un producto. (Requiere backend)
 * @param {number|string} _id
 * @returns {Promise<void>}
 */
export async function deleteProduct(_id) {
  return notImplemented('deleteProduct')
}

/** Indica si el servicio esta hablando con un backend real. */
export const isUsingApi = Boolean(API_BASE_URL)
