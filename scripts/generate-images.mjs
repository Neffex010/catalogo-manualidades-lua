/**
 * generate-images.mjs
 * -----------------------------------------------------------------------------
 * PIPELINE DE IMAGENES DEL CATALOGO.
 *
 * El catalogo trae las fotos en un unico tamano (800x1000). Este script crea,
 * para cada foto, las derivadas que el navegador necesita de verdad:
 *
 *   - 3 anchos en AVIF y WebP   -> se usan en el `srcset` de <picture>
 *   - un LQIP diminuto (~0.5 KB) -> placeholder borroso mientras descarga
 *   - el color promedio          -> fondo instantaneo, sin peticion de red
 *
 * Ademas regenera los recursos de marca (logotipos, favicon, imagen OG) en el
 * tamano exacto para el que se muestran.
 *
 * Ejecutar:  npm run images
 * Es idempotente: se puede volver a lanzar cada vez que se anade una foto.
 * -----------------------------------------------------------------------------
 */

import { readdir, mkdir, writeFile, rm, rename, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const CATALOG_DIR = path.join(PUBLIC_DIR, 'images', 'catalogo')
const BRAND_DIR = path.join(PUBLIC_DIR, 'images', 'brand')
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'images.json')

/* --- Ajustes del catalogo -------------------------------------------------- */

/** Anchos generados. El original mide 800px, asi que nunca escalamos hacia arriba. */
const WIDTHS = [400, 600, 800]

/** Calidad AVIF: mas agresiva que WebP a igualdad de peso (el codec es superior). */
const AVIF_OPTIONS = { quality: 52, effort: 6, chromaSubsampling: '4:2:0' }

/** Calidad WebP: el sweet spot para fotos de producto sobre fondo liso. */
const WEBP_OPTIONS = { quality: 78, effort: 5, smartSubsample: true }

/** Ancho del placeholder borroso. 24px pesan ~0.5 KB y se ve igual de bien. */
const LQIP_WIDTH = 24
const LQIP_OPTIONS = { quality: 40, effort: 3 }

/* --- Ajustes de marca ------------------------------------------------------ */

/**
 * Derivados de los logotipos. Los PNG de `public/images/brand/` son los MASTERS
 * y nunca se tocan: aqui solo se escriben las versiones WebP que consume la UI.
 *
 * - `logo.png` (317x320) se pinta a 48px en la cabecera -> 128px sobra para retina.
 * - `logo-mark.png` (127x128) se pinta a 128px en el hero. El master ya es 1x,
 *   asi que `withoutEnlargement` lo deja en su tamano nativo: agrandarlo solo
 *   añadiria peso sin ganar nitidez (para eso habria que reemplazar el master).
 */
const BRAND_JOBS = [
  { source: 'logo.png', output: 'logo.webp', width: 128, quality: 86 },
  { source: 'logo-mark.png', output: 'logo-mark.webp', width: 256, quality: 88 },
]

/**
 * Favicons. El navegador de escritorio solo pide el de 32px, asi que se genera
 * ese (antes se servia un PNG de 512px y 49 KB). El de 192px cubre Android.
 */
const FAVICON_JOBS = [
  { source: 'logo.png', output: 'favicon-32.png', size: 32 },
  { source: 'logo.png', output: 'favicon-192.png', size: 192 },
]

/* --- Utilidades ------------------------------------------------------------ */

/** Ruta absoluta -> ruta publica con barras normales, tal como va en el JSON. */
const toPublicUrl = (absolutePath) =>
  `/${path.relative(PUBLIC_DIR, absolutePath).split(path.sep).join('/')}`

/** Lista recursiva de archivos con la extension indicada. */
async function walk(dir, extension) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(full, extension)
      return entry.name.toLowerCase().endsWith(extension) ? [full] : []
    })
  )
  return files.flat()
}

/** Tamano en KB con un decimal, para el resumen de consola. */
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

/** `true` si la ruta existe en disco. */
const exists = async (target) =>
  stat(target).then(
    () => true,
    () => false
  )

/**
 * Color promedio de la foto en hexadecimal.
 * Reduce a 1x1, que es exactamente como se veria la foto desenfocada: un rectangulo
 * de ese tono. Se usa como fondo para que la tarjeta nunca aparezca en blanco.
 */
async function averageColor(input) {
  // `.raw().toBuffer()` devuelve el Buffer de pixeles directamente.
  const { 0: red, 1: green, 2: blue } = await sharp(input)
    .resize(1, 1, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer()

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

/** Junta las variantes en el valor que espera el atributo `srcset`. */
const buildSrcSet = (urls) => urls.map((url) => `${url} ${url.match(/-(\d+)\.[a-z]+$/)[1]}w`).join(', ')

/* --- Catalogo -------------------------------------------------------------- */

async function processCatalog() {
  const sources = await walk(CATALOG_DIR, '.jpg')
  if (sources.length === 0) {
    throw new Error(`No se encontro ningun .jpg en ${CATALOG_DIR}`)
  }

  const manifest = {}
  let bytesBefore = 0
  let bytesAfter = 0
  let bytesRemoved = 0

  for (const [index, source] of sources.entries()) {
    const extension = path.extname(source)
    const base = path.join(path.dirname(source), path.basename(source, extension))
    const metadata = await sharp(source).metadata()

    // Nunca generar un ancho mayor que el original: solo se agranda el peso.
    const widths = WIDTHS.filter((width) => width <= metadata.width)
    if (widths.length === 0) widths.push(metadata.width)

    const avifUrls = []
    const webpUrls = []

    for (const width of widths) {
      const pipeline = sharp(source).resize({ width, withoutEnlargement: true })

      const avifPath = `${base}-${width}.avif`
      const webpPath = `${base}-${width}.webp`
      await pipeline.clone().avif(AVIF_OPTIONS).toFile(avifPath)
      await pipeline.clone().webp(WEBP_OPTIONS).toFile(webpPath)

      avifUrls.push(toPublicUrl(avifPath))
      webpUrls.push(toPublicUrl(webpPath))
      bytesAfter += (await stat(avifPath)).size + (await stat(webpPath)).size
    }

    // Placeholder borroso: se pinta de inmediato y la foto real lo tapa.
    const lqipPath = `${base}-lqip.webp`
    await sharp(source)
      .resize({ width: LQIP_WIDTH })
      .blur(0.6)
      .webp(LQIP_OPTIONS)
      .toFile(lqipPath)
    bytesAfter += (await stat(lqipPath)).size

    manifest[toPublicUrl(source)] = {
      color: await averageColor(source),
      lqip: toPublicUrl(lqipPath),
      width: metadata.width,
      height: metadata.height,
      avif: buildSrcSet(avifUrls),
      webp: buildSrcSet(webpUrls),
    }

    // El JPEG original se conserva como ultimo recurso sin soporte de srcset.
    bytesBefore += (await stat(source)).size
    bytesAfter += (await stat(source)).size
    const legacyWebp = `${base}.webp`
    if (await exists(legacyWebp)) bytesRemoved += (await stat(legacyWebp)).size

    if ((index + 1) % 25 === 0) {
      process.stdout.write(`  ${index + 1}/${sources.length} fotos...\n`)
    }
  }

  // Las .webp sueltas (sin sufijo de ancho) quedaron obsoletas: el srcset ya
  // cubre esa resolucion con `-800.webp` y ademas ofrece AVIF.
  await cleanupLegacyWebp(CATALOG_DIR)

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  return { count: sources.length, bytesBefore, bytesAfter, bytesRemoved }
}

/** Borra los `.webp` antiguos que convivian con su `.jpg` (sin sufijo de ancho). */
async function cleanupLegacyWebp(dir) {
  for (const jpg of await walk(dir, '.jpg')) {
    const legacy = `${jpg.slice(0, -4)}.webp`
    if (await exists(legacy)) await rm(legacy)
  }
}

/* --- Marca ----------------------------------------------------------------- */

async function processBrand() {
  const summary = []

  for (const job of BRAND_JOBS) {
    const source = path.join(BRAND_DIR, job.source)
    const output = path.join(BRAND_DIR, job.output)
    const { width: sourceWidth } = await sharp(source).metadata()

    await sharp(source)
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 6 })
      .toFile(output)

    summary.push({
      archivo: job.output,
      detalle: `desde ${sourceWidth}px`,
      kb: kb((await stat(output)).size),
    })
  }

  for (const job of FAVICON_JOBS) {
    const source = path.join(BRAND_DIR, job.source)
    const output = path.join(PUBLIC_DIR, job.output)
    await sharp(source)
      .resize({ width: job.size, height: job.size, fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(output)
    summary.push({ archivo: job.output, detalle: `${job.size}x${job.size}`, kb: kb((await stat(output)).size) })
  }

  // La imagen de redes ya venia en 1200x630 y solo se re-codifica una vez: al
  // re-comprimir un JPEG optimizado se degradaria sin apenas ganar peso.
  const ogImage = path.join(PUBLIC_DIR, 'og-image.jpg')
  if ((await stat(ogImage)).size > 30 * 1024) {
    const ogTemp = `${ogImage}.tmp`
    await sharp(ogImage).jpeg({ quality: 78, progressive: true, mozjpeg: true }).toFile(ogTemp)
    await rm(ogImage)
    await rename(ogTemp, ogImage)
  }
  summary.push({ archivo: 'og-image.jpg', detalle: '1200x630', kb: kb((await stat(ogImage)).size) })

  // El favicon de 512px queda obsoleto: nunca se descarga, el navegador pide 32px.
  await rm(path.join(PUBLIC_DIR, 'favicon.png'), { force: true })

  return summary
}

/* --- Ejecucion ------------------------------------------------------------- */

async function main() {
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true })

  process.stdout.write('\nCatalogo\n')
  const catalog = await processCatalog()
  process.stdout.write(
    `  ${catalog.count} fotos procesadas.\n` +
      `  Cada dispositivo descarga UNA sola resolucion, en AVIF si puede:\n` +
      `    400w ~16 KB (pantallas normales)   600w ~29 KB (retina pequeno)   800w ~43 KB (retina grande)\n` +
      `  Antes eran 78 KB fijos por tarjeta. En disco: ${kb(catalog.bytesAfter)}` +
      (catalog.bytesRemoved ? ` (liberados ${kb(catalog.bytesRemoved)} de WebP obsoletos)` : '') +
      '\n\n'
  )

  process.stdout.write('\nMarca\n')
  for (const row of await processBrand()) {
    process.stdout.write(`  ${row.archivo.padEnd(18)} ${row.kb.padStart(9)}  ${row.detalle}\n`)
  }
  process.stdout.write('\nListo. Recuerda hacer commit de las imagenes generadas.\n\n')
}

main().catch((error) => {
  process.stderr.write(`\nError: ${error.message}\n\n`)
  process.exitCode = 1
})
