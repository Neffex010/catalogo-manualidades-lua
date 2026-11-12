/**
 * sync-variant-images.mjs
 * -----------------------------------------------------------------------------
 * Prepara las fotos de las variantes de color (estambres e hilos).
 *
 * Las fotos originales viven en `assets/estambres-fotos` (fuera de `public/`
 * para que Vite no las copie al build) con los nombres que salen de Google
 * Drive (guiones, sufijos MINI/B, codigos de tres cifras...).
 * La UI espera un nombre estable y predecible del tipo:
 *
 *   01_BLANCO_KOMFY.webp
 *   06_CIELO_KOTTON_MILK.webp
 *   07_VIDRIO_KOTTON_MILK.webp
 *
 * Este script copia y normaliza cada original al nombre destino, recortandolo a
 * la proporcion 4:5 que usa la tarjeta. Es idempotente: se puede volver a
 * lanzar cuando se reemplacen las fotos.
 *
 * Ejecutar:  npm run variants
 * -----------------------------------------------------------------------------
 */

import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = path.join(ROOT, 'assets', 'estambres-fotos')
const DEST_DIR = path.join(ROOT, 'public', 'images', 'catalogo')

/** Proporcion final: la misma que el contenedor `aspect-4/5` de ProductCard. */
const OUTPUT_WIDTH = 800
const OUTPUT_HEIGHT = 1000

/**
 * Origen -> destino. El destino es exactamente el nombre que arma
 * `src/data/products.js`, asi que ambos archivos deben cambiar juntos.
 *
 * @type {Array<{ category: 'estambres'|'hilos', target: string, source: string }>}
 */
const JOBS = [
  /* Estambres Komfy */
  { category: 'estambres', target: '01_BLANCO_KOMFY.webp', source: '01_BLANCO_KOMFY-MINI_B_1.webp' },
  { category: 'estambres', target: '02_CIELO_KOMFY.webp', source: '06_CIELO_KOMFY-MINI_B_1.webp' },
  { category: 'estambres', target: '03_ROJO_KOMFY.webp', source: '78-ROJO-ESCOLAR_KOMFY_MINI_B_1.webp' },
  { category: 'estambres', target: '04_ROSA_KOMFY.webp', source: '185-ROSA-BTE_KOMFY-MINI_B_1.webp' },
  { category: 'estambres', target: '05_LILA_KOMFY.webp', source: '20_LILA_KOMFY-MINI_B_1.webp' },
  { category: 'estambres', target: '06_MARFIL_KOMFY.webp', source: '25_MARFIL_KOMFY-MINI_B_1.webp' },
  { category: 'estambres', target: '07_ARENA_KOMFY.webp', source: '29_ARENA_KOMFY-_MINI_B_1.webp' },
  { category: 'estambres', target: '08_VERDE_KOMFY.webp', source: '164_VERDE-AGUA_KOMFY-MINI_B_1.webp' },

  /* Estambres Kotton Milk */
  { category: 'estambres', target: '01_BLANCO_KOTTON_MILK.webp', source: '01_BLANCO_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '02_NEGRO_KOTTON_MILK.webp', source: '99_NEGRO_KOTTON_MILK_B.webp' },
  { category: 'estambres', target: '03_ROJO_KOTTON_MILK.webp', source: '78-ROJO_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '04_ROSA_KOTTON_MILK.webp', source: '15_PALO-DE-ROSA_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '05_CIELO_KOTTON_MILK.webp', source: '6_CIELO_KOTTON_MILK_B_1.webp' },
  { category: 'estambres', target: '06_VIDRIO_KOTTON_MILK.webp', source: '07_VIDRIO_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '07_LILA_KOTTON_MILK.webp', source: '106_LILA_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '08_BEIGE_KOTTON_MILK.webp', source: '171_CANELA_KOTTON-MILK_B.webp' },
  { category: 'estambres', target: '09_VERDE_KOTTON_MILK.webp', source: '97_BOTELLA_KOTTON_MILK_B.webp' },
  { category: 'estambres', target: '10_GRIS_KOTTON_MILK.webp', source: '103_-GRIS-PLATA_KOTTON-MILK_B.webp' },

  /* Hilos Komfy */
  { category: 'hilos', target: '01_BLANCO_KOMFY.webp', source: '01_BLANCO_KOMFY-MINI_B_1.webp' },
  { category: 'hilos', target: '02_CIELO_KOMFY.webp', source: '06_CIELO_KOMFY-MINI_B_1.webp' },
  { category: 'hilos', target: '03_LILA_KOMFY.webp', source: '20_LILA_KOMFY-MINI_B_1.webp' },
  { category: 'hilos', target: '04_ROJO_KOMFY.webp', source: '78-ROJO-ESCOLAR_KOMFY_MINI_B_1.webp' },
  { category: 'hilos', target: '05_PEPSI_KOMFY.webp', source: '121_PEPSI_KOMFY-MINI_B_1.webp' },
  { category: 'hilos', target: '06_TABACO_KOMFY.webp', source: '93-TABACO_KOMFY_B_1.webp' },
  { category: 'hilos', target: '07_MARFIL_KOMFY.webp', source: '25_MARFIL_KOMFY-MINI_B_1.webp' },
  { category: 'hilos', target: '08_ARENA_KOMFY.webp', source: '29_ARENA_KOMFY-_MINI_B_1.webp' },

  /* Hilos Kotton Milk */
  { category: 'hilos', target: '01_BLANCO_KOTTON_MILK.webp', source: '01_BLANCO_KOTTON-MILK_B.webp' },
  { category: 'hilos', target: '02_NEGRO_KOTTON_MILK.webp', source: '99_NEGRO_KOTTON_MILK_B.webp' },
  { category: 'hilos', target: '03_ROJO_KOTTON_MILK.webp', source: '78-ROJO_KOTTON-MILK_B.webp' },
  { category: 'hilos', target: '04_ROSA_KOTTON_MILK.webp', source: '180_ROSA-3_KOTTON-MILK_B.webp' },
  { category: 'hilos', target: '05_CIELO_KOTTON_MILK.webp', source: '6_CIELO_KOTTON_MILK_B_1.webp' },
  { category: 'hilos', target: '06_VIDRIO_KOTTON_MILK.webp', source: '07_VIDRIO_KOTTON-MILK_B.webp' },
  { category: 'hilos', target: '07_LILA_KOTTON_MILK.webp', source: '106_LILA_KOTTON-MILK_B.webp' },
  { category: 'hilos', target: '08_NUEZ_KOTTON_MILK.webp', source: '30_Nuez-Cotton_Milk_B_1.webp' },
  { category: 'hilos', target: '09_MENTA_KOTTON_MILK.webp', source: '59-MENTITA_KOTTON-MILK_B_1_2_1.webp' },
  { category: 'hilos', target: '10_MANGO_KOTTON_MILK.webp', source: '38_MANGO_KOTTON-MILK_B.webp' },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

async function main() {
  let totalBytes = 0
  let copied = 0

  for (const job of JOBS) {
    const source = path.join(SOURCE_DIR, job.source)
    const destinationDir = path.join(DEST_DIR, job.category)
    const destination = path.join(destinationDir, job.target)

    // Si falta un original se avisa y se continua: el resto del catalogo sigue
    // siendo valido y la tarjeta mostrara su imagen de respaldo.
    const sourceExists = await stat(source).then(
      () => true,
      () => false
    )
    if (!sourceExists) {
      process.stderr.write(`  Falta ${job.source}; se omite ${job.category}/${job.target}\n`)
      continue
    }

    await mkdir(destinationDir, { recursive: true })
    await sharp(source)
      .resize({
        width: OUTPUT_WIDTH,
        height: OUTPUT_HEIGHT,
        fit: 'cover',
        position: sharp.strategy.attention,
        withoutEnlargement: false,
      })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(destination)

    totalBytes += (await stat(destination)).size
    copied += 1
  }

  process.stdout.write(
    `\n${copied}/${JOBS.length} variantes listas en public/images/catalogo (${kb(totalBytes)}).\n\n`
  )
}

main().catch((error) => {
  process.stderr.write(`\nError: ${error.message}\n\n`)
  process.exitCode = 1
})
