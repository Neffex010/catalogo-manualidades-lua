/**
 * availability.js
 * -----------------------------------------------------------------------------
 * Disponibilidad de un producto o de un color.
 *
 * La tienda apenas empieza y todavia no lleva un inventario numerico. Para no
 * publicar existencias que no existen, el dato es OPCIONAL:
 *
 *   - `stock: 12`  -> disponible (y se puede mostrar la cifra)
 *   - `stock: 0`   -> agotado de forma explicita
 *   - sin `stock`  -> sin dato: se invita a confirmar por WhatsApp
 *
 * Ausencia de dato NO es agotado. Ese es el error que este modulo evita.
 * -----------------------------------------------------------------------------
 */

/** Estados posibles de un producto o color. */
export const AVAILABILITY = {
  AVAILABLE: 'available',
  SOLD_OUT: 'sold-out',
  UNKNOWN: 'unknown',
}

/**
 * Estado de una variante de color.
 * @param {{ stock?: number|null }} variant
 * @returns {'available'|'sold-out'|'unknown'}
 */
export function getVariantStatus(variant) {
  if (!variant) return AVAILABILITY.UNKNOWN

  const stock = variant.stock
  if (typeof stock !== 'number' || !Number.isFinite(stock)) {
    return AVAILABILITY.UNKNOWN
  }

  return stock > 0 ? AVAILABILITY.AVAILABLE : AVAILABILITY.SOLD_OUT
}

/**
 * Estado del producto completo.
 *
 * Manda lo que se sepa de sus colores. Si ningun color tiene dato, se usa el
 * booleano heredado `available` y, si tampoco existe, queda como desconocido.
 *
 * @param {{ variants?: Array<object>, available?: boolean|null }} product
 * @returns {'available'|'sold-out'|'unknown'}
 */
export function getProductStatus(product) {
  if (!product) return AVAILABILITY.UNKNOWN

  const variants = Array.isArray(product.variants) ? product.variants : []
  const statuses = variants.map(getVariantStatus)
  const known = statuses.filter((status) => status !== AVAILABILITY.UNKNOWN)

  if (known.includes(AVAILABILITY.AVAILABLE)) return AVAILABILITY.AVAILABLE
  if (known.length > 0) return AVAILABILITY.SOLD_OUT

  if (product.available === true) return AVAILABILITY.AVAILABLE
  if (product.available === false) return AVAILABILITY.SOLD_OUT

  return AVAILABILITY.UNKNOWN
}

/**
 * Primer color que se puede ofrecer sin mentir: el primero disponible y, si
 * ninguno lo esta, el primero de la lista.
 *
 * @param {Array<{ id: string, stock?: number|null }>} variants
 * @returns {string|null}
 */
export function getInitialVariantId(variants = []) {
  const available = variants.find(
    (variant) => getVariantStatus(variant) === AVAILABILITY.AVAILABLE
  )
  return (available ?? variants[0])?.id ?? null
}
