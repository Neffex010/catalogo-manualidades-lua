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
 * Incluye el nombre exacto del producto y, cuando hay una variante activa, su
 * codigo y nombre de color para que la tienda sepa de inmediato que pedir.
 *
 * Las etiquetas NO se incluyen: en el mensaje solo sobraban. Los datos siguen
 * en el catalogo porque la busqueda (`matchesSearch`) y el JSON-LD los usan
 * como palabras clave, aunque ya no se muestren.
 *
 * @param {object} product
 * @param {object|null} [variant] Variante de color activa
 * @returns {string}
 */
export function buildProductMessage(product, variant = null) {
  if (!product) return GENERAL_MESSAGE

  const color = variant
    ? ` (Color: ${variant.colorCode} - ${variant.colorName})`
    : ''

  return `Hola, me interesa pedir: ${product.name}${color}`
}

/**
 * Mensaje para un diseno del portafolio. No es una compra de inventario: se
 * pregunta por una pieza hecha a pedido tomando la foto como referencia.
 *
 * @param {object} design
 * @returns {string}
 */
export function buildDesignMessage(design) {
  if (!design) return GENERAL_MESSAGE

  const type = design.subcategory ? ` (${design.subcategory})` : ''

  return `Hola, me interesa encargar un diseño como: ${design.name}${type}. ¿Me podrían cotizar?`
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
 * Enlace de cotizacion de un producto (con su variante de color si aplica).
 * @param {object} product
 * @param {object|null} [variant]
 * @returns {string}
 */
export function getProductWhatsAppUrl(product, variant = null) {
  return buildWhatsAppUrl({ text: buildProductMessage(product, variant) })
}

/**
 * Enlace para encargar un diseno del portafolio.
 * @param {object} design
 * @returns {string}
 */
export function getDesignWhatsAppUrl(design) {
  return buildWhatsAppUrl({ text: buildDesignMessage(design) })
}

/**
 * Enlace de contacto general.
 * @returns {string}
 */
export function getGeneralWhatsAppUrl() {
  return buildWhatsAppUrl({ text: GENERAL_MESSAGE })
}
