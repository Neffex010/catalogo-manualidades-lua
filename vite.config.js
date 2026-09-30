import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { BRAND, SOCIAL_LINKS } from './src/config/site.js'

// https://vite.dev/config/

/**
 * URL publica del sitio. Es la fuente de verdad para las metaetiquetas que los
 * buscadores exigen en formato absoluto: canonical, og:url, og:image y los datos
 * estructurados. Definala en `.env` (copia `.env.example`) o en el entorno del
 * build. Se le quita la barra final para poder concatenar rutas sin duplicarla.
 */
const DEFAULT_SITE_URL = 'https://manualidadeslua.com'

/** Normaliza una URL de sitio: sin barra final, con protocolo. */
function normalizeSiteUrl(value) {
  const raw = String(value || '').trim()
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

/**
 * Genera el JSON-LD del catalogo (Organization + WebSite + ItemList) a partir de
 * `src/data/products.json`, de modo que los buscadores tengan los datos de las
 * piezas sin tener que ejecutar JavaScript.
 *
 * Solo se incluyen nombre, imagen, categoria y etiquetas: meter las 105
 * descripciones inflaria el HTML del build sin aportar nada a un buscador.
 *
 * @param {string} siteUrl URL publica sin barra final
 * @returns {string} etiqueta <script> con el JSON-LD
 */
function buildCatalogJsonLd(siteUrl) {
  const productsPath = new URL('./src/data/products.json', import.meta.url)
  const products = JSON.parse(readFileSync(productsPath, 'utf-8'))

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
      '@id': `${siteUrl}/#catalogo`,
      name: `Catálogo de ${BRAND.name}`,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          category: product.category,
          image: `${siteUrl}${product.image_url}`,
          url: `${siteUrl}/#catalogo`,
          ...(product.tags?.length ? { keywords: product.tags.join(', ') } : {}),
        },
      })),
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
