/**
 * site.js
 * -----------------------------------------------------------------------------
 * FUENTE UNICA DE VERDAD para los datos de la marca y los canales de contacto.
 * Cualquier cambio (numero de WhatsApp, handles, textos) se hace aqui y se
 * refleja en toda la aplicacion sin tocar ningun componente.
 * -----------------------------------------------------------------------------
 */

/**
 * Numero de WhatsApp con clave de pais, SOLO DIGITOS y sin signos.
 * Formato internacional: 52 (Mexico) + 10 digitos.
 *
 * >>> CAMBIA AQUI el numero real de la tienda <<<
 * Ejemplo: '5215512345678'
 */
export const WHATSAPP_NUMBER = '5210000000000'

/** Identidad de la marca */
export const BRAND = {
  name: 'MANUALIDADES LUA',
  tagline: 'Creaciones artesanales tejidas con amor 🧶',
  shortDescription:
    'Amigurumis, recuerdos para eventos, ramos de flores y llaveros miniatura, tejidos a mano una pieza por una, con materiales nobles y mucho cariño.',

  /**
   * Logotipo de la marca. Los PNG de `public/images/brand/` son los MASTERS y
   * los WebP son los derivados que genera `npm run images` (nunca se editan a
   * mano: si cambias el arte, reemplaza el PNG y vuelve a lanzar el script).
   *
   * - `logo`     -> cabecera y pie (se pinta a 48px como maximo).
   * - `mark`     -> recorte compacto para el hero (se pinta a 128px).
   * - `fallback` -> solo se descarga si el WebP no estuviera disponible.
   * Cambia SOLO estas rutas si en algun momento sustituyes los archivos.
   */
  logo: {
    src: '/images/brand/logo.webp',
    fallback: '/images/brand/logo.png',
    mark: '/images/brand/logo-mark.webp',
    markFallback: '/images/brand/logo-mark.png',
    width: 317,
    height: 320,
    alt: 'Logotipo de Manualidades Lua',
  },
}

/**
 * Las 4 categorias oficiales del catalogo, en el orden en que deben mostrarse.
 * Este listado es la fuente de verdad de la navegacion: el filtro SIEMPRE
 * muestra las 4 (aunque alguna llegue vacia desde la base de datos) y, si el
 * backend agrega una categoria nueva, esta se anade al final automaticamente.
 *
 * @type {ReadonlyArray<{ name: string, label: string, description: string }>}
 */
export const CATEGORIES = [
  {
    name: 'Amigurumis',
    label: 'Amigurumis',
    description: 'Figuras grandes y muñecos principales',
  },
  {
    name: 'Eventos',
    label: 'Eventos',
    description: 'Recuerdos para bautizos, graduaciones y más',
  },
  {
    name: 'Flores',
    label: 'Flores',
    description: 'Ramos y arreglos florales tejidos',
  },
  {
    name: 'Llaveros',
    label: 'Llaveros',
    description: 'Piezas miniatura y variadas',
  },
]

/** Etiqueta de la opcion que muestra el catalogo completo sin filtros. */
export const ALL_CATEGORY_LABEL = 'Todos'

/** Valor interno de la categoria "todos" (nunca colisiona con un nombre real). */
export const ALL_CATEGORY = 'all'

/** Redes sociales mostradas en la cabecera */
export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@manualidades_lua_',
    href: 'https://www.instagram.com/manualidades_lua_',
    icon: 'instagram',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'Manualidades lua',
    href: 'https://www.facebook.com/ManualidadesLua',
    icon: 'facebook',
  },
]

/** Secciones de la landing */
export const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'contacto', label: 'Contacto' },
]
