/**
 * format.js
 * -----------------------------------------------------------------------------
 * Formateadores compartidos por la interfaz. Se declaran una sola vez para que
 * todos los precios se vean igual (moneda, separador de miles y decimales).
 * -----------------------------------------------------------------------------
 */

const MXN_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/**
 * Formatea un precio en pesos mexicanos.
 * @param {number} value
 * @returns {string} Ej. "$1,250" o "$69"
 */
export function formatPrice(value) {
  const price = Number(value)
  return Number.isFinite(price) ? MXN_FORMATTER.format(price) : MXN_FORMATTER.format(0)
}

/**
 * Normaliza un texto removiendo acentos y diacríticos, y convirtiendo a minúsculas.
 * Fuente única de normalización para comparaciones de texto, búsqueda y colores.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeToken(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

