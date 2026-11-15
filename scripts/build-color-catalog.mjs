/**
 * build-color-catalog.mjs
 * -----------------------------------------------------------------------------
 * Prepara la CARTA DE COLOR de la tienda.
 *
 * Los originales viven en `assets/<marca>/` con los nombres que salen de Drive
 * (codigos, guiones, sufijos `_B`, `_MINI`, etc.). Este script:
 *
 *   1. Detecta las fotos de color de cada marca (ignora capturas y referencias).
 *   2. Normaliza codigo + nombre de color a partir del nombre del archivo.
 *   3. Genera una miniatura cuadrada WebP en
 *      `public/images/catalogo/carta-colores/<marca>/`.
 *   4. Escribe `src/data/colorCatalog.json` con marcas, tonos, color promedio y
 *      la ruta de la foto 4:5 que genera despues `npm run variants`.
 *
 * Es idempotente: se puede volver a lanzar cuando cambien las fotos.
 *
 * Ejecutar:  npm run colors
 * -----------------------------------------------------------------------------
 */

import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = path.join(ROOT, 'assets')
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'catalogo', 'carta-colores')
const CARD_DIR = '/images/catalogo/estambres'
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'colorCatalog.json')

/** Marcas visibles en la carta, en el orden en que se presentan. */
const BRANDS = [
  { dir: 'komfy mini', id: 'komfy-mini', name: 'Komfy Mini', type: 'Estambre' },
  { dir: 'Kotton milk', id: 'kotton-milk', name: 'Kotton Milk', type: 'Estambre e hilo' },
  { dir: 'karina kairo', id: 'karina-kairo', name: 'Karina Kairo', type: 'Estambre' },
  { dir: 'trapillo kraft', id: 'trapillo-kraft', name: 'Trapillo Kraft', type: 'Trapillo' },
  { dir: 'alize velluto', id: 'alize-velluto', name: 'Alize Velluto', type: 'Estambre' },
]

const IMAGE_EXTENSION = /\.(?:webp|jpe?g|png)$/i
const REFERENCE_FILE = /^(?:smartselect|img_|d_nq_|alize-velluto)/i

/** Palabras que forman parte del nombre del archivo pero no del color. */
const SKIP_TOKENS = new Set([
  'b',
  'n',
  'mini',
  'kraft',
  'lkraft',
  'komfy',
  'kofy',
  'kotton',
  'kottom',
  'milk',
  'cotton',
  'kairo',
  'velluto',
  'trapillo',
])

/** Conectores que se quedan en minuscula al titular un color. */
const SMALL_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'y'])

/** Correcciones de acentos y siglas que el nombre del archivo no conserva. */
const NAME_FIXES = {
  sandia: 'Sandía',
  limon: 'Limón',
  chicharo: 'Chícharo',
  hues: 'Hueso',
  nordico: 'Nórdico',
  'rosa bb': 'Rosa BB',
  'rosa bte': 'Rosa BTE',
  'gris rata': 'Gris Rata',
  'verde agua': 'Verde Agua',
  'palo de rosa': 'Palo de Rosa',
  'amarillo paja': 'Amarillo Paja',
  'amarillo pollo': 'Amarillo Pollo',
  'rojo escolar': 'Rojo Escolar',
  'verde militar': 'Verde Militar',
  'gris perla': 'Gris Perla',
  'gris plata': 'Gris Plata',
  'rosa pastel': 'Rosa Pastel',
  'rosa nieve': 'Rosa Nieve',
}

/** Titula un color sin romper conectores ("Palo de Rosa"). */
function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && SMALL_WORDS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/** Texto seguro para usar como nombre de archivo. */
function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extrae codigo y nombre de color del nombre original.
 *
 *   `08_TURQUEZA_KAIRO_B.webp`   -> 08 / Turquesa
 *   `103_-GRIS-PLATA...webp`     -> 103 / Gris Plata
 *   `06-6.webp`                  -> 06 / ''
 *   `56_KOTTON-MILK_B.webp`      -> 56 / ''
 */
function parseColorFilename(filename) {
  const base = filename
    .replace(IMAGE_EXTENSION, '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .trim()

  const tokens = base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ')

  let code = ''
  if (/^\d+$/.test(tokens[0])) {
    code = tokens[0].padStart(2, '0')
    tokens.shift()
  }

  const nameTokens = tokens.filter((token) => {
    const normalized = token.toLowerCase()
    return !SKIP_TOKENS.has(normalized) && !/^\d+$/.test(normalized)
  })

  const rawName = nameTokens.join(' ')
  const name = NAME_FIXES[rawName.toLowerCase()] ?? toTitleCase(rawName)

  return { code, name }
}

/** Color promedio de la foto, usado como fondo y respaldo de la muestra. */
async function averageColor(source) {
  const buffer = await sharp(source)
    .flatten({ background: '#FFFFFF' })
    .resize(1, 1, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer()

  const [red, green, blue] = buffer
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

/** Crea la miniatura cuadrada que se pinta en la carta. */
async function writeThumbnail(source, destination) {
  await sharp(source)
    .flatten({ background: '#FFFFFF' })
    .resize({
      width: 320,
      height: 320,
      fit: 'cover',
      // Las fotos son verticales y la etiqueta suele estar al centro: el
      // recorte superior conserva la textura del hilo, no el empaque.
      position: 'top',
    })
    .webp({ quality: 78, effort: 4, smartSubsample: true })
    .toFile(destination)
}

async function main() {
  const manifest = []
  let totalColors = 0
  let totalBytes = 0

  await rm(OUTPUT_DIR, { recursive: true, force: true })

  for (const brand of BRANDS) {
    const sourceDir = path.join(ASSETS_DIR, brand.dir)
    const brandDir = path.join(OUTPUT_DIR, brand.id)

    const files = (await readdir(sourceDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSION.test(name) && !REFERENCE_FILE.test(name))
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

    if (files.length === 0) {
      process.stderr.write(`  ${brand.name}: sin fotos, se omite.\n`)
      continue
    }

    await mkdir(brandDir, { recursive: true })

    const seen = new Set()
    const colors = []

    for (const filename of files) {
      const { code, name } = parseColorFilename(filename)
      if (!code) {
        process.stderr.write(`  ${brand.name}: ${filename} sin codigo, se omite.\n`)
        continue
      }

      // Evita duplicados reales (mismo codigo y mismo color con otro sufijo).
      const key = `${code}|${name.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)

      const source = path.join(sourceDir, filename)
      const outputName = `${code}${name ? `-${slugify(name)}` : ''}.webp`
      const destination = path.join(brandDir, outputName)

      await writeThumbnail(source, destination)

      const imageUrl = `/images/catalogo/carta-colores/${brand.id}/${outputName}`
      const cardImage = `${CARD_DIR}/${brand.id}/${outputName}`
      const bytes = (await stat(destination)).size
      totalBytes += bytes

      colors.push({
        code,
        name,
        hex: await averageColor(source),
        image: imageUrl,
        imageCard: cardImage,
        // Nombre del archivo original: `npm run variants` lo usa para generar
        // la foto 4:5 de la tarjeta sin volver a adivinar el color.
        source: filename,
      })
    }

    colors.sort((a, b) => Number(a.code) - Number(b.code))
    totalColors += colors.length

    manifest.push({
      id: brand.id,
      name: brand.name,
      type: brand.type,
      dir: brand.dir,
      colors,
    })

    process.stdout.write(`  ${brand.name.padEnd(16)} ${String(colors.length).padStart(3)} tonos\n`)
  }

  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify({ brands: manifest }, null, 2)}\n`,
    'utf8'
  )

  process.stdout.write(
    `\n${manifest.length} marcas · ${totalColors} tonos · ${(totalBytes / 1024 / 1024).toFixed(1)} MB de miniaturas.\n` +
      `Manifiesto: src/data/colorCatalog.json\n\n`
  )
}

main().catch((error) => {
  process.stderr.write(`\nError: ${error.message}\n\n`)
  process.exitCode = 1
})
