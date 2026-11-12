/**
 * products.js
 * -----------------------------------------------------------------------------
 * FUENTE UNICA DEL CATALOGO.
 *
 * El catalogo se compone de dos familias:
 *
 *   - MANUALIDADES: piezas unicas (amigurumis, eventos, flores y llaveros).
 *     Vienen de `manualidades.js` y no manejan variantes de color.
 *
 *   - ESTAMBRES / HILOS: productos con variantes. Cada color es una variante
 *     independiente con su propio codigo, nombre, muestra de color, imagen y
 *     stock. Las imagenes se nombran con el formato de Google Drive:
 *
 *       01_BLANCO_KOMFY.webp
 *       06_CIELO_KOTTON_MILK.webp
 *       07_VIDRIO_KOTTON_MILK.webp
 *
 * `parseDriveFilename` traduce ese nombre a la estructura que consume la UI.
 * -----------------------------------------------------------------------------
 */

import { MANUALIDADES } from './manualidades.js'
import { FALLBACK_SWATCH } from '../utils/color.js'
import { normalizeToken } from '../utils/format.js'

/** Ruta publica por defecto de las fotos de variantes. */
const VARIANTS_BASE_PATH = '/images/catalogo'

/**
 * Paleta de referencia para las muestras circulares. Las claves van sin
 * acentos y en minusculas porque `parseDriveFilename` normaliza los nombres
 * antes de buscar aqui.
 */
export const COLOR_HEX = {
  blanco: '#F8F5EF',
  negro: '#1C1917',
  rojo: '#B9373F',
  rosa: '#E7A6B8',
  amarillo: '#E8C35A',
  cielo: '#A9D6E5',
  vidrio: '#B8C9C5',
  lila: '#B79EE6',
  verde: '#6E9F7A',
  beige: '#D8C3A5',
  gris: '#9CA3AF',
  cafe: '#8B5E3C',
  turquesa: '#4FB3A9',
  mostaza: '#D4A72C',
  coral: '#E8836B',
  melon: '#F0B49A',
  menta: '#A8D5BA',
  lavanda: '#C9B6E4',
  marino: '#2F4A6D',
  vino: '#7B2D3A',
  hueso: '#EFE9DC',
  arena: '#DCC9A8',
  terracota: '#C46A4A',
  'azul rey': '#3457A6',
  azul: '#4A78B5',
  naranja: '#E38B3D',
  purpura: '#7D4FA8',
  fucsia: '#C4457E',
  olivo: '#7A7F4A',
  chocolate: '#5B3A29',
  marfil: '#F2E8D8',
  pepsi: '#2B4C7E',
  tabaco: '#7A5A3A',
  nuez: '#8A6A4F',
  mango: '#E39B3F',
}

/** Nombres de color ordenados de mas a menos palabras (para "azul rey"). */
const COLOR_KEYS = Object.keys(COLOR_HEX).sort((a, b) => {
  const words = b.split(' ').length - a.split(' ').length
  return words !== 0 ? words : b.length - a.length
})

/** Extensiones de imagen aceptadas en los nombres de archivo. */
const IMAGE_EXTENSION = /\.(?:webp|avif|jpe?g|png)$/i

/** Convierte "KOTTON MILK" en "Kotton Milk" sin romper siglas cortas. */
function toTitleCase(value) {
  return String(value ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Convierte un texto en slug seguro para usarlo como id. */
function slugify(value) {
  return normalizeToken(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Convierte un nombre de archivo de Google Drive en una variante de producto.
 *
 * Formatos soportados:
 *   - 01_BLANCO_KOMFY.webp      -> { colorCode: '01', colorName: 'Blanco', line: 'Komfy' }
 *   - 06_CIELO_KOTTON_MILK.webp -> { colorCode: '06', colorName: 'Cielo', line: 'Kotton Milk' }
 *   - 07_VIDRIO_KOTTON_MILK.webp
 *
 * Tambien acepta rutas completas; solo se conserva el nombre del archivo.
 *
 * @param {string} filename Nombre del archivo (con o sin ruta)
 * @param {{ basePath?: string, stock?: number }} [options]
 * @returns {{
 *   id: string,
 *   colorCode: string,
 *   colorName: string,
 *   hexColor: string,
 *   imageUrl: string,
 *   stock: number,
 *   line: string
 * } | null}
 */
export function parseDriveFilename(filename, { basePath = VARIANTS_BASE_PATH, stock = 0 } = {}) {
  const raw = String(filename ?? '').trim()
  if (!raw) return null

  const baseName = raw.split(/[\\/]/).pop()
  const withoutExtension = baseName.replace(IMAGE_EXTENSION, '')
  const tokens = withoutExtension.split(/[_\s]+/).map((token) => token.trim()).filter(Boolean)
  if (tokens.length === 0) return null

  // Codigo numerico inicial: 01, 06, 07...
  let colorCode = ''
  let cursor = 0
  if (/^\d+$/.test(tokens[0])) {
    colorCode = tokens[0].padStart(2, '0')
    cursor = 1
  }

  const remaining = tokens.slice(cursor)
  if (remaining.length === 0) return null

  const normalizedRemaining = remaining.map(normalizeToken)

  // Se busca el nombre de color mas largo que coincida al inicio:
  // "AZUL_REY" antes que "AZUL", para no dejar "REY" como si fuera la linea.
  let colorTokenCount = 0
  for (const colorKey of COLOR_KEYS) {
    const colorTokens = colorKey.split(' ')
    const matches = colorTokens.every((token, index) => normalizedRemaining[index] === token)
    if (matches) {
      colorTokenCount = colorTokens.length
      break
    }
  }

  // Sin coincidencia en la paleta: el primer token es el color y el resto la linea.
  if (colorTokenCount === 0) colorTokenCount = 1

  const colorTokens = remaining.slice(0, colorTokenCount)
  const lineTokens = remaining.slice(colorTokenCount)
  const rawColorName = colorTokens.join(' ')
  const colorName = toTitleCase(rawColorName)
  const line = toTitleCase(lineTokens.join(' '))
  const normalizedColor = normalizeToken(rawColorName)
  const normalizedStock = Number(stock)

  return {
    id: [colorCode || 'sin-codigo', slugify(rawColorName), line ? slugify(line) : '']
      .filter(Boolean)
      .join('-'),
    colorCode: colorCode || '—',
    colorName,
    hexColor: COLOR_HEX[normalizedColor] ?? FALLBACK_SWATCH,
    imageUrl: raw.startsWith('/')
      ? raw
      : `${String(basePath).replace(/\/+$/, '')}/${baseName}`,
    stock: Number.isFinite(normalizedStock) ? Math.max(0, normalizedStock) : 0,
    line,
  }
}

/**
 * Construye la lista de variantes a partir de los nombres de archivo.
 *
 * `idPrefix` (normalmente el id del producto) evita que dos productos de la
 * misma linea compartan ids de variante: el estambre y el hilo "01 Blanco
 * Kotton Milk" son variantes distintas aunque el archivo se llame igual.
 *
 * @param {string[]} filenames
 * @param {{ basePath?: string, stock?: number, stockByColor?: Record<string, number>, idPrefix?: string }} [options]
 * @returns {Array<ReturnType<typeof parseDriveFilename>>}
 */
function buildVariants(
  filenames,
  { basePath = VARIANTS_BASE_PATH, stock = 12, stockByColor = {}, idPrefix = '' } = {}
) {
  return filenames
    .map((filename) => {
      const code = filename.match(/^(\d+)/)?.[1]?.padStart(2, '0')
      const variantStock =
        code && Object.prototype.hasOwnProperty.call(stockByColor, code)
          ? stockByColor[code]
          : stock

      const variant = parseDriveFilename(filename, { basePath, stock: variantStock })
      if (!variant) return null

      return idPrefix ? { ...variant, id: `${idPrefix}-${variant.id}` } : variant
    })
    .filter(Boolean)
}

/* ========================================================================== */
/* Fotografias por linea                                                      */
/* ========================================================================== */

/**
 * Los nombres de archivo son la unica fuente del codigo, color y linea de cada
 * variante. Deben existir en `public/images/catalogo` con ese nombre exacto:
 * `npm run variants` los genera a partir de las fotos de `assets/estambres-fotos`.
 *
 * Si se agrega un color, se anade aqui y en el mapa de `scripts/sync-variant-images.mjs`.
 */

const KOMFY_YARN_FILENAMES = [
  '01_BLANCO_KOMFY.webp',
  '02_CIELO_KOMFY.webp',
  '03_ROJO_KOMFY.webp',
  '04_ROSA_KOMFY.webp',
  '05_LILA_KOMFY.webp',
  '06_MARFIL_KOMFY.webp',
  '07_ARENA_KOMFY.webp',
  '08_VERDE_KOMFY.webp',
]

const KOTTON_MILK_YARN_FILENAMES = [
  '01_BLANCO_KOTTON_MILK.webp',
  '02_NEGRO_KOTTON_MILK.webp',
  '03_ROJO_KOTTON_MILK.webp',
  '04_ROSA_KOTTON_MILK.webp',
  '05_CIELO_KOTTON_MILK.webp',
  '06_VIDRIO_KOTTON_MILK.webp',
  '07_LILA_KOTTON_MILK.webp',
  '08_BEIGE_KOTTON_MILK.webp',
  '09_VERDE_KOTTON_MILK.webp',
  '10_GRIS_KOTTON_MILK.webp',
]

const KOMFY_THREAD_FILENAMES = [
  '01_BLANCO_KOMFY.webp',
  '02_CIELO_KOMFY.webp',
  '03_LILA_KOMFY.webp',
  '04_ROJO_KOMFY.webp',
  '05_PEPSI_KOMFY.webp',
  '06_TABACO_KOMFY.webp',
  '07_MARFIL_KOMFY.webp',
  '08_ARENA_KOMFY.webp',
]

const KOTTON_MILK_THREAD_FILENAMES = [
  '01_BLANCO_KOTTON_MILK.webp',
  '02_NEGRO_KOTTON_MILK.webp',
  '03_ROJO_KOTTON_MILK.webp',
  '04_ROSA_KOTTON_MILK.webp',
  '05_CIELO_KOTTON_MILK.webp',
  '06_VIDRIO_KOTTON_MILK.webp',
  '07_LILA_KOTTON_MILK.webp',
  '08_NUEZ_KOTTON_MILK.webp',
  '09_MENTA_KOTTON_MILK.webp',
  '10_MANGO_KOTTON_MILK.webp',
]

/* ========================================================================== */
/* Estambres                                                                  */
/* ========================================================================== */

const KOMFY_VARIANTS = buildVariants(KOMFY_YARN_FILENAMES, {
  basePath: `${VARIANTS_BASE_PATH}/estambres`,
  idPrefix: 'estambre-komfy',
  stock: 18,
  // El lila esta agotado y el arena queda por reponer.
  stockByColor: { '05': 0, '07': 3 },
})

const KOTTON_MILK_YARN_VARIANTS = buildVariants(KOTTON_MILK_YARN_FILENAMES, {
  basePath: `${VARIANTS_BASE_PATH}/estambres`,
  idPrefix: 'estambre-kotton-milk',
  stock: 14,
  stockByColor: { '02': 0, '08': 4 },
})

/* ========================================================================== */
/* Hilos                                                                      */
/* ========================================================================== */

const KOTTON_MILK_THREAD_VARIANTS = buildVariants(KOTTON_MILK_THREAD_FILENAMES, {
  basePath: `${VARIANTS_BASE_PATH}/hilos`,
  idPrefix: 'hilo-kotton-milk',
  stock: 22,
  stockByColor: { '03': 0 },
})

const KOMFY_THREAD_VARIANTS = buildVariants(KOMFY_THREAD_FILENAMES, {
  basePath: `${VARIANTS_BASE_PATH}/hilos`,
  idPrefix: 'hilo-komfy',
  stock: 25,
  stockByColor: { '06': 0 },
})

/* ========================================================================== */
/* Catalogo con variantes                                                     */
/* ========================================================================== */

const VARIANT_PRODUCTS = [
  {
    id: 'estambre-komfy',
    name: 'Estambre Komfy',
    brand: 'Komfy',
    category: 'estambres',
    price: 69,
    description:
      'Estambre acrílico de tacto suave y hebra uniforme, ideal para amigurumis, cobijas y prendas de uso diario. Cada ovillo rinde para proyectos medianos y conserva el color después de varios lavados.',
    imageUrl: KOMFY_VARIANTS[0].imageUrl,
    available: KOMFY_VARIANTS.some((variant) => variant.stock > 0),
    tags: ['estambre', 'acrílico', 'komfy', 'ovillo', 'tejido'],
    variants: KOMFY_VARIANTS,
  },
  {
    id: 'estambre-kotton-milk',
    name: 'Estambre Kotton Milk',
    brand: 'Kotton Milk',
    category: 'estambres',
    price: 79,
    description:
      'Mezcla de algodón y acrílico con acabado mate y muy suave al roce. Es la elección favorita para piezas de bebé, accesorios y amigurumis que necesitan caída y frescura.',
    imageUrl: KOTTON_MILK_YARN_VARIANTS[0].imageUrl,
    available: KOTTON_MILK_YARN_VARIANTS.some((variant) => variant.stock > 0),
    tags: ['estambre', 'algodón', 'kotton milk', 'bebé', 'suave'],
    variants: KOTTON_MILK_YARN_VARIANTS,
  },
  {
    id: 'hilo-kotton-milk',
    name: 'Hilo Kotton Milk',
    brand: 'Kotton Milk',
    category: 'hilos',
    price: 49,
    description:
      'Hilo de algodón mercerizado de brillo discreto y gran resistencia. Perfecto para bordado, crochet fino, llaveros y detalles que necesitan una puntada limpia y definida.',
    imageUrl: KOTTON_MILK_THREAD_VARIANTS[0].imageUrl,
    available: KOTTON_MILK_THREAD_VARIANTS.some((variant) => variant.stock > 0),
    tags: ['hilo', 'algodón', 'mercerizado', 'kotton milk', 'bordado', 'crochet fino'],
    variants: KOTTON_MILK_THREAD_VARIANTS,
  },
  {
    id: 'hilo-komfy',
    name: 'Hilo Komfy',
    brand: 'Komfy',
    category: 'hilos',
    price: 39,
    description:
      'Hilo de poliéster de alta tenacidad, pensado para costuras resistentes y trabajos que estarán en movimiento. No se deshilacha con facilidad y mantiene el color por más tiempo.',
    imageUrl: KOMFY_THREAD_VARIANTS[0].imageUrl,
    available: KOMFY_THREAD_VARIANTS.some((variant) => variant.stock > 0),
    tags: ['hilo', 'poliéster', 'komfy', 'resistente', 'costura'],
    variants: KOMFY_THREAD_VARIANTS,
  },
]

/**
 * Catalogo completo listo para consumir. El orden importa: primero las piezas
 * artesanales y despues los productos con variantes, para que la pestaña
 * "Todos" conserve la curaduria original.
 */
export const PRODUCTS = [...MANUALIDADES, ...VARIANT_PRODUCTS]

export default PRODUCTS
