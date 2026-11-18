/**
 * build-color-catalog.mjs
 * -----------------------------------------------------------------------------
 * Prepara la CARTA DE COLOR de la tienda.
 *
 * Los originales viven en `assets/<marca>/` con los nombres que salen de Drive
 * (codigos, guiones, sufijos `_B`, `_MINI`, indices, hash y tamano). Como cada
 * marca los nombra distinto, cada una declara su propio lector y todas terminan
 * en la misma forma: codigo oficial + nombre del color. Este script:
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

/**
 * Marcas visibles en la carta, en el orden en que se presentan.
 *
 * Primero las hilazas y estambres de algodon, al final el trapillo porque no es
 * estambre. El orden de este arreglo es el de las pestanas y las tarjetas.
 */
const BRANDS = [
  { dir: 'sinfonia', id: 'sinfonia', name: 'Sinfonía', type: 'Hilaza', parse: 'sinfonia' },
  { dir: 'abuelita', id: 'la-abuelita', name: 'La Abuelita', type: 'Hilaza', parse: 'abuelita' },
  { dir: 'candy', id: 'candy', name: 'Candy', type: 'Estambre', parse: 'candy' },
  { dir: 'karina kairo', id: 'karina-kairo', name: 'Karina Kairo', type: 'Estambre', parse: 'classic' },
  { dir: 'komfy mini', id: 'komfy-mini', name: 'Komfy Mini', type: 'Estambre', parse: 'classic' },
  { dir: 'Kotton milk', id: 'kotton-milk', name: 'Kotton Milk', type: 'Estambre e hilo', parse: 'classic' },
  { dir: 'alize velluto', id: 'alize-velluto', name: 'Alize Velluto', type: 'Estambre', parse: 'classic' },
  { dir: 'trapillo kraft', id: 'trapillo-kraft', name: 'Trapillo Kraft', type: 'Trapillo', parse: 'classic' },
]

const IMAGE_EXTENSION = /\.(?:webp|jpe?g|png)$/i
const REFERENCE_FILE = /^(?:smartselect|img_|d_nq_|gemini|alize-velluto)/i

/** Sufijos de tamano que Drive agrega al final del nombre. */
const IMAGE_SIZE = new Set(['0', '320', '480', '640', '1024'])

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
  melon: 'Melón',
  salmon: 'Salmón',
  cafe: 'Café',
  'cafe mink': 'Café Mink',
  'cafe claro': 'Café Claro',
  'cafe oscuro': 'Café Oscuro',
  'cafe frijol': 'Café Frijol',
  pina: 'Piña',
  cempasuchil: 'Cempasúchil',
  chicharo: 'Chícharo',
  cicharo: 'Chícharo',
  turqueza: 'Turquesa',
  cancun: 'Cancún',
  pacifico: 'Pacífico',
  orquidea: 'Orquídea',
  nordico: 'Nórdico',
  carmin: 'Carmín',
  purpura: 'Púrpura',
  melocoton: 'Melocotón',
  chedron: 'Chedrón',
  fiusha: 'Fucsia',
  fisha: 'Fucsia',
  hues: 'Hueso',
  'rosa bb': 'Rosa BB',
  'rosa bte': 'Rosa BTE',
  'rosa nina': 'Rosa Niña',
  'rosa mex': 'Rosa Mexicano',
  'rosa medio': 'Rosa Medio',
  'rosa pastel': 'Rosa Pastel',
  'rosa nieve': 'Rosa Nieve',
  'rosa tierno': 'Rosa Tierno',
  'rosa viejo': 'Rosa Viejo',
  'gris rata': 'Gris Rata',
  'gris perla': 'Gris Perla',
  'gris plata': 'Gris Plata',
  'gris claro': 'Gris Claro',
  'gris oscuro': 'Gris Oscuro',
  'gris acero': 'Gris Acero',
  'gris niebla': 'Gris Niebla',
  'gris oxford': 'Gris Oxford',
  'verde agua': 'Verde Agua',
  'verde limon': 'Verde Limón',
  'verde citrico': 'Verde Cítrico',
  'verde aguacate': 'Verde Aguacate',
  'verde manzana': 'Verde Manzana',
  'verde pasto': 'Verde Pasto',
  'verde cristal': 'Verde Cristal',
  'verde niebla': 'Verde Niebla',
  'verde fresco': 'Verde Fresco',
  'verde hoja': 'Verde Hoja',
  'verde pradera': 'Verde Pradera',
  'verde bandera': 'Verde Bandera',
  'palo de rosa': 'Palo de Rosa',
  'amarillo paja': 'Amarillo Paja',
  'amarillo pollo': 'Amarillo Pollo',
  'amarillo bebe': 'Amarillo Bebé',
  'amarillo medio': 'Amarillo Medio',
  'amarillo vivo': 'Amarillo Vivo',
  'amarillo intenso': 'Amarillo Intenso',
  'amarillo neon': 'Amarillo Neón',
  'rojo escolar': 'Rojo Escolar',
  'rojo sangre': 'Rojo Sangre',
  'verde militar': 'Verde Militar',
  'verde neon': 'Verde Neón',
  'fiusha neon': 'Fucsia Neón',
  'naranja neon': 'Naranja Neón',
  'media noche': 'Media Noche',
  'azul frances': 'Azul Francés',
  'azul marino': 'Azul Marino',
  'azul nordico': 'Azul Nórdico',
  'azul orquidea': 'Azul Orquídea',
  'azul rey': 'Azul Rey',
  'azul cielo': 'Azul Cielo',
  'azul cancun': 'Azul Cancún',
  'azul pacifico': 'Azul Pacífico',
  'azul cenizo': 'Azul Cenizo',
  'turquesa oscuro': 'Turquesa Oscuro',
  'morado intenso': 'Morado Intenso',
  'lila claro': 'Lila Claro',
  'rosa mexicano': 'Rosa Mexicano',
  'canela fuerte': 'Canela Fuerte',
  'agua fuerte': 'Agua Fuerte',
  'olivo intenso': 'Olivo Intenso',
  'dulce rosa': 'Dulce Rosa',
  'lavanda seco': 'Lavanda Seco',
  'matizado cafes': 'Matizado Cafés',
  'matizado espanol': 'Matizado Español',
  'matizado melon': 'Matizado Melón',
}

/**
 * La Abuelita usa dos formatos: con indice (`1-abuelita-blanco-011-...`) y sin
 * el (`abuelita-aceituna-89-...`). En ambos el ultimo numero antes del hash es
 * el codigo de dos digitos; Verde Pradera es la excepcion sin codigo.
 */
const ABUELITA_CODE_OVERRIDES = {
  'verde pradera': '85',
}

/** Candy omite el codigo en algunas fotos: se completa con la lista oficial. */
const CANDY_CODE_BY_NAME = {
  beige: '1823',
  blanco: '1801',
  carne: '1874',
  negro: '1825',
  agua: '1848',
  cafe: '1821',
  camello: '1850',
  cielo: '1815',
  'media noche': '1847',
  melon: '1811',
  naranja: '1805',
  'rojo sangre': '1807',
  rojo: '1806',
  rosa: '1809',
  salmon: '1834',
  turquesa: '1816',
  vino: '1830',
}

/** Quita acentos y mayusculas para comparar nombres de color. */
function plain(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
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

/** Nombre del archivo sin extension ni sufijo de descarga "(1)". */
function baseName(filename) {
  return filename
    .replace(IMAGE_EXTENSION, '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .trim()
}

/** Parte el nombre en tokens por guiones, guiones bajos y espacios. */
function tokenize(filename) {
  return baseName(filename)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

/** Hash de Drive: cadena hexadecimal larga que no es codigo ni tamano. */
function isHashToken(token) {
  return /^[0-9a-f]{12,}$/i.test(token)
}

/** Devuelve los tokens que forman parte del color (antes del hash). */
function visibleTokens(tokens) {
  const hashIndex = tokens.findIndex(isHashToken)
  return hashIndex >= 0 ? tokens.slice(0, hashIndex) : tokens
}

/**
 * Limpia los tokens visibles y devuelve el nombre del color ya titularizado.
 *
 * @param {string[]} tokens
 * @param {Set<string>} brandWords palabras propias de la marca
 */
function colorName(tokens, brandWords) {
  const kept = visibleTokens(tokens)
    .map((token) => token.replace(/\(\d+\)/g, '').replace(/\d+$/, ''))
    .filter((token) => {
      if (!token) return false
      const normalized = token.toLowerCase()
      return (
        !brandWords.has(normalized) &&
        !SKIP_TOKENS.has(normalized) &&
        !/^\d+$/.test(normalized)
      )
    })

  const rawName = kept.join(' ')
  return NAME_FIXES[plain(rawName)] ?? toTitleCase(rawName)
}

/**
 * Formato clasico: el codigo es el primer token.
 *
 *   `08_TURQUEZA_KAIRO_B.webp`   -> 08 / Turquesa
 *   `103_-GRIS-PLATA...webp`     -> 103 / Gris Plata
 *   `06-6.webp`                  -> 06 / ''
 */
function parseClassic(filename) {
  const tokens = tokenize(filename)

  let code = ''
  if (/^\d+$/.test(tokens[0] ?? '')) {
    code = tokens.shift().padStart(2, '0')
  }

  const nameTokens = tokens.filter((token) => {
    const normalized = token.toLowerCase()
    return !SKIP_TOKENS.has(normalized) && !/^\d+$/.test(normalized)
  })

  const rawName = nameTokens.join(' ')
  const name = NAME_FIXES[plain(rawName)] ?? toTitleCase(rawName)

  return { code, name }
}

/**
 * La Abuelita: codigo de dos digitos pegado al nombre (`011`, `0811`, `451`).
 * El indice inicial, cuando existe, se descarta porque va antes de la marca.
 */
function parseAbuelita(filename) {
  const tokens = tokenize(filename)
  const numbers = visibleTokens(tokens).filter(
    (token) => /^\d+$/.test(token) && token.length <= 5 && !IMAGE_SIZE.has(token)
  )

  const name = colorName(tokens, new Set(['abuelita', 'hilaza']))
  const lastNumber = numbers[numbers.length - 1]
  const code =
    ABUELITA_CODE_OVERRIDES[plain(name)] ??
    (lastNumber ? lastNumber.slice(0, 2).padStart(2, '0') : '')

  return { code, name }
}

/**
 * Candy: codigo de cuatro digitos que empieza con 18 (`18121`, `1849`). Algunas
 * fotos no lo traen y el color se resuelve con la lista oficial de la marca.
 */
function parseCandy(filename) {
  const tokens = tokenize(filename)
  const codeToken = tokens.find((token) => /^18\d{2,4}$/.test(token))
  const name = colorName(tokens, new Set(['candy']))
  const code = codeToken
    ? codeToken.slice(0, 4)
    : CANDY_CODE_BY_NAME[plain(name)] ?? ''

  return { code, name }
}

/**
 * Sinfonia: codigo de tres digitos antes del hash (`8011` -> 801). Dos fotos
 * traen el codigo despues del nombre de la marca (`sinfonia-891-verde-bandera`),
 * por eso hay un respaldo.
 */
function parseSinfonia(filename) {
  const tokens = tokenize(filename)
  const visible = visibleTokens(tokens)

  let codeToken = visible[visible.length - 1] ?? ''
  if (!/^\d{3,5}$/.test(codeToken)) {
    const brandIndex = tokens.findIndex((token) => plain(token) === 'sinfonia')
    const next = brandIndex >= 0 ? tokens[brandIndex + 1] : undefined
    codeToken = /^\d{3,5}$/.test(next ?? '') ? next : ''
  }

  const name = colorName(tokens, new Set(['sinfonia']))

  return { code: codeToken ? codeToken.slice(0, 3) : '', name }
}

const PARSERS = {
  classic: parseClassic,
  abuelita: parseAbuelita,
  candy: parseCandy,
  sinfonia: parseSinfonia,
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

    // Un color puede repetirse con distinto tamano: se conserva la foto mas
    // grande. El codigo es la identidad del tono, no el nombre del archivo.
    const byCode = new Map()
    const parse = PARSERS[brand.parse] ?? parseClassic

    for (const filename of files) {
      const { code, name } = parse(filename)
      if (!code) {
        process.stderr.write(`  ${brand.name}: ${filename} sin codigo, se omite.\n`)
        continue
      }

      const source = path.join(sourceDir, filename)
      const bytes = (await stat(source)).size
      const current = byCode.get(code)

      if (!current || bytes > current.bytes) {
        byCode.set(code, { code, name, filename, bytes })
      }
    }

    const colors = []

    for (const entry of byCode.values()) {
      const source = path.join(sourceDir, entry.filename)
      const outputName = `${entry.code}${entry.name ? `-${slugify(entry.name)}` : ''}.webp`
      const destination = path.join(brandDir, outputName)

      await writeThumbnail(source, destination)

      const imageUrl = `/images/catalogo/carta-colores/${brand.id}/${outputName}`
      const cardImage = `${CARD_DIR}/${brand.id}/${outputName}`
      const bytes = (await stat(destination)).size
      totalBytes += bytes

      colors.push({
        code: entry.code,
        name: entry.name,
        hex: await averageColor(source),
        image: imageUrl,
        imageCard: cardImage,
        // Nombre del archivo original: `npm run variants` lo usa para generar
        // la foto 4:5 de la tarjeta sin volver a adivinar el color.
        source: entry.filename,
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
