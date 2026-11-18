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
 * Numero de la tienda: 771 141 5822 (lada de Pachuca, Hidalgo).
 */
export const WHATSAPP_NUMBER = '527711415822'

/**
 * Datos de la tienda fisica y atencion.
 *
 * `mapsUrl` usa la busqueda de Google Maps en lugar de coordenadas fijas: si la
 * direccion cambia, basta con editar `addressQuery` y el enlace se regenera.
 */
const addressQuery = 'San Antonio el Desmonte, calle 24 de febrero No. 33, Pachuca, Hidalgo, México'

export const CONTACT = {
  address: {
    street: 'San Antonio el Desmonte, calle 24 de febrero No. 33',
    reference: 'Dentro de "Ferre-eléctrica Chofo"',
    city: 'Pachuca, Hidalgo, México',
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`,
  },
  hours: '1:00 pm a 9:00 pm',
  phone: {
    display: '771-141-5822',
    href: 'tel:+527711415822',
  },
  whatsappDisplay: '+52 771 141 5822',
}

/**
 * Marcas y tipos de hilo/estambre que se ofrecen en tienda.
 * Se muestran como etiquetas en la seccion "Visitanos".
 */
export const MATERIAL_BRANDS = [
  'Sinfonía',
  'La Abuelita',
  'Candy',
  'Karina Kairo',
  'Komfy Mini',
  'Kotton Milk',
  'Alize Velluto',
  'Cristal',
  'Hilo Vela',
  'Hilo para coser',
]

/** Otros productos disponibles ademas de hilos y estambres. */
export const STORE_EXTRAS = [
  'Accesorios para tejido',
  'Bastidores y aros de bordado',
  'Ganchillos',
]

/** Servicios que ofrece la tienda. */
export const STORE_SERVICES = ['Tejido por encargo', 'Pedidos personalizados']

/**
 * Categorias cuyos productos manejan variantes de color (selector de muestras).
 *
 * El precio NO se decide por categoria: cada producto publica `price` solo si
 * la tienda ya definio una cifra. Si falta, la UI muestra "Se cotiza por
 * WhatsApp".
 */
export const VARIANT_CATEGORIES = new Set(['estambres', 'hilos'])

/** Imagen de respaldo usada en toda la aplicacion cuando un producto no tiene foto. */
export const FALLBACK_IMAGE = '/images/product-placeholder.svg'

/** Identidad de la marca */
export const BRAND = {
  name: 'MANUALIDADES LUA',
  tagline: 'Creaciones artesanales tejidas con amor 🧶',
  shortDescription:
    'Amigurumis, recuerdos para eventos, ramos de flores, llaveros miniatura, estambres e hilos para tus propios proyectos. Piezas tejidas a mano una por una, con materiales nobles y mucho cariño.',

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
 * Las 3 categorias oficiales del catalogo, en el orden en que deben mostrarse.
 * Este listado es la fuente de verdad de la navegacion: el filtro SIEMPRE
 * muestra las 3 (aunque alguna llegue vacia desde la base de datos) y, si el
 * backend agrega una categoria nueva, esta se anade al final automaticamente.
 *
 * @type {ReadonlyArray<{ name: string, label: string, description: string }>}
 */
export const CATEGORIES = [
  {
    name: 'manualidades',
    label: 'Manualidades',
    description: 'Amigurumis, eventos, flores y llaveros tejidos a mano',
  },
  {
    name: 'estambres',
    label: 'Estambres',
    description: 'Ovillos suaves para tejer y crear',
  },
  {
    name: 'hilos',
    label: 'Hilos',
    description: 'Hilos finos para bordado, crochet y costura',
  },
]

/** Mapa de nombres de categoria a sus etiquetas legibles. */
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((category) => [category.name, category.label])
)

/**
 * Subcategorias de las piezas artesanales. Se conservan para mostrarlas como
 * etiqueta en cada tarjeta aunque la categoria principal sea `manualidades`.
 */
export const SUBCATEGORIES = [
  { name: 'Amigurumis', label: 'Amigurumis' },
  { name: 'Eventos', label: 'Eventos' },
  { name: 'Flores', label: 'Flores' },
  { name: 'Llaveros', label: 'Llaveros' },
]

/** Etiqueta de la opcion que muestra el catalogo completo sin filtros. */
export const ALL_CATEGORY_LABEL = 'Todos'

/** Valor interno de la categoria "todos" (nunca colisiona con un nombre real). */
export const ALL_CATEGORY = 'all'

/**
 * Redes sociales mostradas en la cabecera y en la seccion de tienda.
 * Se recorren con un mapa, asi que anadir una red es agregar una entrada aqui y
 * su icono en SOCIAL_ICONS de cada componente que la use.
 */
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
    // El enlace corto de la tienda (facebook.com/share/1EZSg9avSf) redirige
    // aqui; se guarda la URL canonica del perfil, que no caduca.
    handle: 'Manualidades lua',
    href: 'https://www.facebook.com/ManualidadesLua1',
    icon: 'facebook',
  },
]

/** Secciones de la landing: portafolio, materiales y tienda fisica. */
export const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'disenos', label: 'Diseños' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'tienda', label: 'Tienda' },
]
