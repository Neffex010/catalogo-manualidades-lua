/**
 * color.js
 * -----------------------------------------------------------------------------
 * Utilidades de color compartidas por las muestras de variantes.
 * -----------------------------------------------------------------------------
 */

import { normalizeToken } from './format.js'

/** Muestra neutra cuando el nombre del color no esta en la paleta. */
export const FALLBACK_SWATCH = '#D6D3D1'

/**
 * Familias de color para organizar los estambres.
 *
 * Se agrupan por temperatura percibida, no por codigo: asi alguien que busca
 * "algo calido" no tiene que recorrer los 17 nombres uno por uno. El orden es
 * el que se muestra en el filtro.
 */
export const COLOR_FAMILIES = [
  { id: 'calidos', label: 'Cálidos', hint: 'Rojos, rosas, mangos y maderas' },
  { id: 'frios', label: 'Fríos', hint: 'Cielos, lilas, mentas y verdes' },
  { id: 'neutros', label: 'Neutros', hint: 'Blancos, grises, arenas y negros' },
]

/** Valor interno de "todas las familias" (nunca colisiona con un id real). */
export const ALL_COLOR_FAMILY = 'all'

/**
 * Mapa nombre de color -> familia. Las claves van normalizadas (minusculas y
 * sin acentos) porque los nombres vienen del catalogo y pueden variar.
 */
const COLOR_FAMILY_BY_NAME = {
  mango: 'calidos',
  rojo: 'calidos',
  rosa: 'calidos',
  tabaco: 'calidos',
  nuez: 'calidos',
  cielo: 'frios',
  lila: 'frios',
  menta: 'frios',
  pepsi: 'frios',
  verde: 'frios',
  vidrio: 'frios',
  blanco: 'neutros',
  marfil: 'neutros',
  arena: 'neutros',
  beige: 'neutros',
  gris: 'neutros',
  negro: 'neutros',
}

/**
 * Devuelve el id de la familia de un color (`calidos`, `frios`, `neutros`).
 * Si el nombre no esta mapeado cae en `neutros`, que es la opcion segura:
 * nunca desaparece del filtro ni queda inaccesible.
 */
export function getColorFamily(colorName) {
  return COLOR_FAMILY_BY_NAME[normalizeToken(colorName)] ?? 'neutros'
}

/** Convierte #RGB o #RRGGBB a canales numericos. */
export function hexToRgb(hex) {
  const value = String(hex ?? '').replace('#', '').trim()
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(value)) return null

  const expanded =
    value.length === 3
      ? value
          .split('')
          .map((channel) => `${channel}${channel}`)
          .join('')
      : value

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  }
}

/**
 * Indica si un color es claro y necesita texto oscuro encima.
 * Usa luminancia percibida (YIQ), suficiente para elegir blanco o negro.
 */
export function isLightColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return true
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 150
}
