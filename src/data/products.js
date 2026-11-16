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
 *   - ESTAMBRES: una tarjeta por marca real, con TODOS los tonos que existen en
 *     `assets/`. La lista sale de `src/data/colorCatalog.json`, el mismo
 *     manifiesto que alimenta la carta de color: no hay una segunda lista de
 *     colores que se pueda desactualizar.
 *
 * Cada tono apunta a la foto 4:5 que genera `npm run variants`. El stock y el
 * precio siguen siendo OPCIONALES: si la tienda no los define, la UI invita a
 * confirmarlos por WhatsApp en lugar de inventar cifras.
 * -----------------------------------------------------------------------------
 */

import { MANUALIDADES } from './manualidades.js'
import colorCatalog from './colorCatalog.json'
import { normalizeToken } from '../utils/format.js'

/** Nombre comercial de la tarjeta. El trapillo no es estambre. */
const PRODUCT_NAMES = {
  'komfy-mini': 'Estambre Komfy Mini',
  'kotton-milk': 'Estambre Kotton Milk',
  'karina-kairo': 'Estambre Karina Kairo',
  'trapillo-kraft': 'Trapillo Kraft',
  'alize-velluto': 'Estambre Alize Velluto',
}

/**
 * Copy breve por marca. Describe usos generales, nunca composicion, precio ni
 * existencias: esos datos solo se publican cuando la tienda los carga. El
 * llamado a WhatsApp vive una sola vez en la seccion, no en cada descripcion.
 */
const PRODUCT_DESCRIPTIONS = {
  'komfy-mini': 'Para amigurumis, accesorios y proyectos de uso diario.',
  'kotton-milk': 'También disponible como hilo.',
  'karina-kairo': 'Para prendas, accesorios y detalles.',
  'trapillo-kraft': 'Para bolsos, cestas y piezas de mayor cuerpo.',
  'alize-velluto': 'Textura suave para piezas de abrigo y detalles.',
}

/** Etiquetas por marca (se usan como palabras clave, no se muestran). */
const PRODUCT_TAGS = {
  'komfy-mini': ['estambre', 'ovillo', 'amigurumi', 'tejido', 'komfy mini'],
  'kotton-milk': ['estambre', 'hilo', 'ovillo', 'suave', 'kotton milk'],
  'karina-kairo': ['estambre', 'ovillo', 'prendas', 'tejido', 'karina kairo'],
  'trapillo-kraft': ['trapillo', 'ovillo', 'bolsos', 'cestas', 'trapillo kraft'],
  'alize-velluto': ['estambre', 'ovillo', 'suave', 'abrigo', 'alize velluto'],
}

/** Convierte un nombre de color en un fragmento seguro de id. */
function slugify(value) {
  return normalizeToken(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Convierte una marca del manifiesto en un producto comprable.
 *
 * @param {object} brand
 * @returns {object}
 */
function buildBrandProduct(brand) {
  const variants = brand.colors.map((color) => {
    const colorName = color.name || `Tono ${color.code}`

    return {
      id: `${brand.id}-${color.code}-${slugify(colorName) || 'tono'}`,
      colorCode: color.code,
      colorName,
      hexColor: color.hex,
      imageUrl: color.imageCard,
      // Sin dato de inventario: la tarjeta invita a confirmar por WhatsApp.
      stock: null,
    }
  })

  return {
    id: `estambre-${brand.id}`,
    name: PRODUCT_NAMES[brand.id] ?? brand.name,
    brand: brand.name,
    // Linea comercial real del manifiesto: evita llamar "estambre" al trapillo.
    type: brand.type,
    category: 'estambres',
    description: PRODUCT_DESCRIPTIONS[brand.id] ?? '',
    // 4:5, la misma proporcion del contenedor de la tarjeta.
    width: 800,
    height: 1000,
    imageUrl: variants[0]?.imageUrl ?? null,
    tags: PRODUCT_TAGS[brand.id] ?? ['estambre', 'ovillo', 'tejido'],
    variants,
  }
}

/** Tarjetas de Materiales: una por marca con foto real. */
const BRAND_PRODUCTS = colorCatalog.brands.map(buildBrandProduct)

/**
 * Catalogo completo listo para consumir. El orden importa: primero las piezas
 * artesanales y despues las marcas, para que la pestaña "Todos" conserve la
 * curaduria original.
 */
export const PRODUCTS = [...MANUALIDADES, ...BRAND_PRODUCTS]

export default PRODUCTS
