import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { BRAND, SOCIAL_LINKS } from './src/config/site.js'
import { PRODUCTS } from './src/data/products.js'

// https://vite.dev/config/

/**
 * URL publica del sitio. Es la fuente de verdad para las metaetiquetas que los
 * buscadores exigen en formato absoluto: canonical, og:url, og:image y los datos
 * estructurados. Definala en `.env` (copia `.env.example`) o en el entorno del
 * build. Se le quita la barra final para poder concatenar rutas sin duplicarla.
 */
const DEFAULT_SITE_URL = 'https://manualidadeslua.com'

/** Normaliza una URL de sitio: sin barra final, con protocolo.
 *  Se elimina TODO espacio en blanco: en una URL nunca es valido y suele colarse
 *  al copiar y pegar (p. ej. "https:// midominio.app"), rompiendo canonical y og:url. */
function normalizeSiteUrl(value) {
  const raw = String(value || '').replace(/\s+/g, '')
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

/**
 * Genera el JSON-LD del catalogo (Organization + WebSite + dos ItemList) a
 * partir de `src/data/products.js`, de modo que los buscadores tengan los datos
 * sin tener que ejecutar JavaScript.
 *
 * Los dos bloques se publican por separado porque tienen una intencion
 * distinta:
 *
 *   - `#disenos`: piezas tejidas a pedido. Se describen como `VisualArtwork`
 *     (portafolio), sin oferta ni disponibilidad: no son inventario.
 *   - `#materiales`: hilos y estambres. Se publican como `Product`. Solo se
 *     emite `offers` cuando la tienda ya definio un precio real; una cifra
 *     inventada seria peor que omitirla. La disponibilidad se declara solo si
 *     existe el dato (`available` booleano).
 *
 * @param {string} siteUrl URL publica sin barra final
 * @returns {string} etiqueta <script> con el JSON-LD
 */
function buildCatalogJsonLd(siteUrl) {
  const designs = PRODUCTS.filter((product) => product.category === 'manualidades')
  const materials = PRODUCTS.filter((product) => product.category !== 'manualidades')

  /** Imagen de la primera variante disponible; si no hay dato, la del producto. */
  const getImageUrl = (product) => {
    const primaryVariant =
      product.variants?.find((variant) => Number(variant.stock) > 0) ?? product.variants?.[0]
    return `${siteUrl}${primaryVariant?.imageUrl ?? product.imageUrl}`
  }

  const designItems = designs.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'VisualArtwork',
      '@id': `${siteUrl}/#diseno-${product.id}`,
      name: product.name,
      description: product.description,
      image: getImageUrl(product),
      url: `${siteUrl}/#disenos`,
      artform: 'Crochet',
      artMedium: 'Hilo y estambre',
      creator: { '@id': `${siteUrl}/#organization` },
      ...(product.subcategory ? { genre: product.subcategory } : {}),
      ...(product.tags?.length ? { keywords: product.tags.join(', ') } : {}),
    },
  }))

  const materialItems = materials.map((product, index) => {
    const hasPrice = Number.isFinite(product.price)
    const hasAvailability = typeof product.available === 'boolean'

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${siteUrl}/#material-${product.id}`,
        name: product.name,
        description: product.description,
        category: 'Hilos y estambres',
        image: getImageUrl(product),
        url: `${siteUrl}/#materiales`,
        ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
        ...(product.tags?.length ? { keywords: product.tags.join(', ') } : {}),
        ...(hasPrice
          ? {
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'MXN',
                ...(hasAvailability
                  ? {
                      availability: product.available
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                    }
                  : {}),
                url: `${siteUrl}/#materiales`,
              },
            }
          : {}),
      },
    }
  })

  const graph = [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: BRAND.name,
      url: `${siteUrl}/`,
      description: BRAND.shortDescription,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/brand/logo.png`,
        width: BRAND.logo.width,
        height: BRAND.logo.height,
      },
      image: `${siteUrl}/og-image.jpg`,
      sameAs: SOCIAL_LINKS.map((social) => social.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: BRAND.name,
      url: `${siteUrl}/`,
      inLanguage: 'es-MX',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#disenos`,
      name: `Diseños tejidos a pedido de ${BRAND.name}`,
      numberOfItems: designItems.length,
      itemListElement: designItems,
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#materiales`,
      name: `Hilos y estambres de ${BRAND.name}`,
      numberOfItems: materialItems.length,
      itemListElement: materialItems,
    },
  ]

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })

  // `</script>` dentro de una descripcion cerraria la etiqueta antes de tiempo.
  const safe = json.replace(/<\//g, '<\\/')

  return `<script type="application/ld+json">${safe}</script>`
}

/**
 * Plugin que resuelve los marcadores de index.html:
 *   %SITE_URL%           -> URL publica del sitio
 *   %CATALOG_JSON_LD%    -> datos estructurados del catalogo
 */
function resolveHtmlPlaceholders(env) {
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || DEFAULT_SITE_URL)

  return {
    name: 'resolve-html-placeholders',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', siteUrl)
        .replaceAll('%CATALOG_JSON_LD%', buildCatalogJsonLd(siteUrl))
    },
  }
}

export default defineConfig(({ mode }) => {
  // `loadEnv` trae tambien las variables de los archivos .env, que no estan
  // disponibles en `process.env` mientras se carga la configuracion.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), resolveHtmlPlaceholders(env)],
    server: {
      port: 5173,
      // Permite abrir la app en la red local (probar en el celular con la misma wifi)
      host: true,
    },
  }
})
