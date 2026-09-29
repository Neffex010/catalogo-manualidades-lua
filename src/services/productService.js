/**
 * productService.js
 * -----------------------------------------------------------------------------
 * CAPA DE DATOS DESACOPLADA de la interfaz.
 *
 * Este modulo es la UNICA pieza que la UI conoce para obtener productos. Hoy
 * resuelve los datos desde un JSON local simulando una llamada asincrona
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

import rawProducts from '../data/products.json'
import imageManifest from '../data/images.json'

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

/** Imagen usada si el backend no devuelve `image_url`. */
const FALLBACK_IMAGE = '/images/product-placeholder.svg'
/** Wrapper de una promesa para simular latencia de red. */
const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/* ========================================================================== */
/* Normalizacion (frontera datos <-> UI)                                     */
/* ========================================================================== */

/**
 * Convierte un registro crudo (JSON de la API) en el modelo que usa la UI.
 * Centralizar esto aqui permite que el backend cambie de nombres de campo
 * (p. ej. `imageUrl`, `precio`, `is_active`) sin romper los componentes.
 *
 * IMAGENES: `src/data/images.json` lo genera `npm run images` y asocia a cada
 * foto local sus variantes (400/600/800 en AVIF y WebP), un placeholder borroso
 * y el color promedio. Si `image_url` apunta a un recurso sin entrada en el
 * manifiesto (p. ej. una URL remota del backend), los campos quedan en `null` y
 * la tarjeta cae a un <img> simple con la imagen original.
 *
 * @param {object} raw
 * @returns {object|null}
 */
function normalizeProduct(raw) {
  if (!raw) return null

  const id = raw.id ?? raw.pk ?? null
  if (id == null) return null

  // Acepta ambas grafias para facilitar la migracion snake_case -> camelCase
  const imageUrl = raw.image_url ?? raw.imageUrl ?? FALLBACK_IMAGE
  const image = imageManifest[imageUrl] ?? null

  return {
    id,
    name: raw.name ?? raw.nombre ?? 'Producto sin nombre',
    category: raw.category ?? raw.categoria ?? 'Sin categoría',
    description: raw.description ?? raw.descripcion ?? '',
    imageUrl,
    // `srcset` listos para <picture>; null si no hay variantes generadas.
    imageSrcSetAvif: image?.avif ?? null,
    imageSrcSetWebp: image?.webp ?? null,
    // Placeholder de ~0.2 KB y color de fondo para que la tarjeta nunca
    // aparezca en blanco mientras la foto viaja por la red.
    imageLqip: image?.lqip ?? null,
    imageColor: image?.color ?? null,
    // Proporcion real de la foto; evita que la tarjeta salte de alto al cargar.
    imageWidth: image?.width ?? raw.width ?? raw.ancho ?? null,
    imageHeight: image?.height ?? raw.height ?? raw.alto ?? null,
    available: Boolean(raw.available ?? raw.disponible ?? true),
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
    return rawProducts.map(normalizeProduct).filter(Boolean)
  },

  async findById(id) {
    await delay()
    const found = rawProducts.find((product) => String(product.id) === String(id))
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
