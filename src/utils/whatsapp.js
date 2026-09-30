/**
 * whatsapp.js
 * -----------------------------------------------------------------------------
 * Genera los enlaces de cotizacion de WhatsApp (formato wa.me).
 * Todo el texto que recibe el cliente se arma aqui para mantenerlo uniforme.
 * -----------------------------------------------------------------------------
 */

import { WHATSAPP_NUMBER } from '../config/site'

/** Prefijo internacional de Mexico usado por la API wa.me. */
const DEFAULT_COUNTRY = '52'

/** Limpia el numero dejando solo digitos (quita +, espacios, guiones, parentesis). */
export function sanitizePhoneNumber(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

/** Arma el numero completo listo para wa.me. */
export function buildPhoneNumber(phone = WHATSAPP_NUMBER) {
  const digits = sanitizePhoneNumber(phone)
  return digits || `${DEFAULT_COUNTRY}10000000000`
}

/**
 * Los mensajes NO llevan emoji a proposito.
 *
 * El texto viaja dentro de una URL (wa.me?text=...) y hay clientes de
 * WhatsApp, sobre todo de escritorio y algunos Web, que solo aceptan el Plano
 * Basico Multilingue: en cuanto aparece un emoji de 4 bytes se muestra un
 * cuadrito con interrogante. Los acentos y la enye, de 2 bytes, si pasan.
 *
 * Un cuadrito en el primer mensaje de una tienda es justo lo que no queremos
 * que vea un comprador, asi que el mensaje es solo texto y negritas de
 * WhatsApp (*texto*), que se renderizan en cualquier version.
 */

/** Mensaje para una consulta general (sin producto). */
export const GENERAL_MESSAGE = [
  '¡Hola! Gracias por visitar el catálogo de Manualidades Lua.',
  '',
  'Me gustaría recibir más información sobre sus creaciones tejidas a mano.',
  '',
  '¿Me podrían compartir precios, tiempos de entrega y opciones de personalización?',
  '¡Muchas gracias!',
].join('\n')

/**
 * Mensaje prellenado de un producto concreto.
 * Incluye el nombre exacto del producto para que la consulta sea clara.
 *
 * @param {object} product
 * @returns {string}
 */
export function buildProductMessage(product) {
  if (!product) return GENERAL_MESSAGE

  const tags = product.tags?.length ? `\nEtiquetas: ${product.tags.join(', ')}` : ''

  return [
    '¡Hola! Vi el catálogo de *Manualidades Lua* y me interesa este producto:',
    '',
    `*${product.name.toUpperCase()}*`,
    `Categoría: ${product.category}${tags}`,
    '',
    'Quisiera saber el *precio* y si es posible *personalizarlo* (colores, detalles, tamaño).',
    'También me gustaría confirmar disponibilidad y tiempo de entrega. ¡Gracias!',
  ].join('\n')
}

/**
 * Construye la URL final de WhatsApp.
 * @param {{ text?: string, phone?: string }} options
 * @returns {string}
 */
export function buildWhatsAppUrl({ text = GENERAL_MESSAGE, phone } = {}) {
  return `https://wa.me/${buildPhoneNumber(phone)}?text=${encodeURIComponent(text)}`
}

/**
 * Enlace de cotizacion de un producto.
 * @param {object} product
 * @returns {string}
 */
export function getProductWhatsAppUrl(product) {
  return buildWhatsAppUrl({ text: buildProductMessage(product) })
}

/**
 * Enlace de contacto general.
 * @returns {string}
 */
export function getGeneralWhatsAppUrl() {
  return buildWhatsAppUrl({ text: GENERAL_MESSAGE })
}
