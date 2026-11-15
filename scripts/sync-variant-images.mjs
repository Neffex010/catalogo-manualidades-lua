/**
 * sync-variant-images.mjs
 * -----------------------------------------------------------------------------
 * Genera la foto 4:5 de cada tono para las tarjetas de Materiales.
 *
 * La lista de tonos NO se escribe a mano: sale de `src/data/colorCatalog.json`,
 * el mismo manifiesto que alimenta la carta de color. Asi una marca nueva o un
 * tono nuevo entra al catalogo con solo dejar la foto en `assets/<marca>/` y
 * lanzar `npm run colors` + `npm run variants`.
 *
 * Por cada tono:
 *   assets/<marca>/<archivo original>  ->  public/images/catalogo/estambres/
 *                                          <marca>/<codigo>-<color>.webp
 *
 * La proporcion 4:5 es la misma que usa `ProductCard` (`aspect-4/5`), de modo
 * que la foto no se recorta dos veces en el navegador.
 *
 * Es idempotente: borra las carpetas generadas y las vuelve a escribir.
 *
 * Ejecutar:  npm run variants
 * -----------------------------------------------------------------------------
 */

import { mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import colorCatalog from '../src/data/colorCatalog.json' with { type: 'json' }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = path.join(ROOT, 'assets')
const PUBLIC_DIR = path.join(ROOT, 'public')
const DEST_DIR = path.join(PUBLIC_DIR, 'images', 'catalogo', 'estambres')

/**
 * Fotos viejas de "hilos": eran las mismas de estambre bajo otro nombre. Se
 * eliminan para no publicar productos que la tienda no respalda con foto.
 */
const LEGACY_HILOS_DIR = path.join(PUBLIC_DIR, 'images', 'catalogo', 'hilos')

const OUTPUT_WIDTH = 800
const OUTPUT_HEIGHT = 1000

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

async function main() {
  if (!Array.isArray(colorCatalog.brands) || colorCatalog.brands.length === 0) {
    throw new Error('colorCatalog.json está vacío. Ejecuta primero `npm run colors`.')
  }

  await rm(DEST_DIR, { recursive: true, force: true })
  await rm(LEGACY_HILOS_DIR, { recursive: true, force: true })
  await mkdir(DEST_DIR, { recursive: true })

  let totalBytes = 0
  let generated = 0
  let expected = 0

  for (const brand of colorCatalog.brands) {
    const sourceDir = path.join(ASSETS_DIR, brand.dir)

    for (const color of brand.colors) {
      expected += 1

      if (!color.imageCard || !color.source) {
        process.stderr.write(
          `  ${brand.name} ${color.code}: manifiesto incompleto; vuelve a lanzar \`npm run colors\`.\n`
        )
        continue
      }

      const source = path.join(sourceDir, color.source)
      const destination = path.join(PUBLIC_DIR, color.imageCard.replace(/^\//, ''))

      try {
        await mkdir(path.dirname(destination), { recursive: true })
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
      } catch {
        process.stderr.write(`  Falta ${color.source} en assets/${brand.dir}; se omite.\n`)
        continue
      }

      totalBytes += (await stat(destination)).size
      generated += 1
    }

    process.stdout.write(
      `  ${brand.name.padEnd(16)} ${String(brand.colors.length).padStart(3)} tonos\n`
    )
  }

  process.stdout.write(
    `\n${generated}/${expected} variantes listas en public/images/catalogo/estambres (${kb(totalBytes)}).\n\n`
  )
}

main().catch((error) => {
  process.stderr.write(`\nError: ${error.message}\n\n`)
  process.exitCode = 1
})
