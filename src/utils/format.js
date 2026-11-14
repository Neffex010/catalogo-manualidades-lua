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
 *
 * Devuelve `null` cuando no hay precio real (la tienda aun no lo define). Asi
 * ningun componente puede terminar mostrando "$0" por accidente.
 *
 * @param {number|string|null|undefined} value
 * @returns {string|null} Ej. "$1,250" o "$69"
 */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return null

  const price = Number(value)
  return Number.isFinite(price) ? MXN_FORMATTER.format(price) : null
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

