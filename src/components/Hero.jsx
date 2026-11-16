/**
 * Hero.jsx
 * -----------------------------------------------------------------------------
 * Portada editorial.
 *
 * La primera pantalla ya no es una reticula de cajas: el titular vive directo
 * sobre el papel, la pieza destacada ocupa una columna completa y los datos de
 * la tienda se leen como una ficha al pie. Se conservan el logotipo, los dos
 * accesos, la carta de color, la pieza destacada y todos sus textos.
 * -----------------------------------------------------------------------------
 */

import { ArrowRight, Palette, Scissors, Sparkles } from 'lucide-react'
import { BRAND } from '../config/site'
import colorCatalog from '../data/colorCatalog.json'

/**
 * Muestra de la carta de color. Los tonos salen del manifiesto real
 * (`colorCatalog.json`), no de una lista paralela que se desactualiza: el hero
 * siempre enseña colores que existen en la tienda. Se eligen los tonos con más
 * saturación para que la paleta se lea de un vistazo sobre el papel.
 */
const HERO_SWATCH_NAMES = ['Rojo Escolar', 'Mango', 'Fucsia', 'Guinda', 'Verde Militar', 'Cafe Craft']

const HERO_SWATCHES = HERO_SWATCH_NAMES.map((name) => {
  for (const brand of colorCatalog.brands) {
    const match = brand.colors.find(
      (color) => color.name.toLowerCase() === name.toLowerCase()
    )
    if (match) return { name, hex: match.hex }
  }
  return null
}).filter(Boolean)

/** Conteo real de la carta, para que el hero no prometa tonos de mas. */
const TOTAL_TONES = colorCatalog.brands.reduce(
  (total, brand) => total + brand.colors.length,
  0
)

/** Foto de la pieza destacada. */
const FEATURED_IMAGE = '/images/catalogo/flores/ramo-romantico-pastel-luces.jpg'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b-2 border-ink/10 bg-canvas"
    >
      {/* Textura de papel + lino: el fondo deja de ser un color plano. */}
      <div aria-hidden="true" className="texture-linen pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="texture-grain pointer-events-none absolute inset-0" />

      {/* Manchas de marca, ahora mas contenidas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-lila-200/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-sand-200/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-stretch lg:gap-10 xl:gap-14">
          {/* --------------------------------------------------------------
           * Columna editorial: marca y propuesta de valor
           * ------------------------------------------------------------ */}
          <div className="flex flex-col lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={BRAND.logo.mark}
                width={BRAND.logo.width}
                height={BRAND.logo.height}
                alt={BRAND.logo.alt}
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                onError={(event) => {
                  event.currentTarget.src = BRAND.logo.markFallback
                }}
              />
              {/* Etiqueta perforada: reutiliza el eslogan de la marca, no
                  agrega informacion nueva. */}
              <span className="rounded-md border border-dashed border-clay/60 bg-clay-soft/80 px-3 py-1.5 text-[12px] font-semibold leading-tight tracking-[0.01em] text-clay-deep">
                {BRAND.tagline}
              </span>
              <span aria-hidden="true" className="hidden h-[2px] flex-1 bg-line sm:block" />
            </div>

            <h1 className="mt-7 font-display text-[3rem] font-semibold leading-[0.93] tracking-[-0.035em] text-ink sm:mt-9 sm:text-[4.4rem] lg:text-[5.4rem] xl:text-[6rem]">
              Diseños tejidos a pedido
              <span className="mt-2 block text-lila-700">
                y los hilos para crear los tuyos
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-[1.65] text-ink-soft sm:mt-7 sm:text-[18px]">
              Amigurumis, flores, recuerdos y llaveros tejidos a mano.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <a
                href="#disenos"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border-2 border-ink bg-brand px-7 py-4 text-[15px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lila-800 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-base"
              >
                <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
                Ver diseños
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>

              <a
                href="#materiales"
                className="link-rule inline-flex items-center gap-2 pb-0.5 text-[15px] font-semibold text-ink transition-colors duration-240 hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-base"
              >
                <Palette className="h-[18px] w-[18px] text-clay" aria-hidden="true" />
                Ver materiales
              </a>
            </div>
          </div>

          {/* --------------------------------------------------------------
           * Columna derecha: pieza destacada + ficha de la tienda
           * ------------------------------------------------------------ */}
          <div className="flex flex-col lg:col-span-5">
            <a
              href="#disenos"
              className="group photo-frame relative flex min-h-[300px] flex-1 overflow-hidden rounded-[1.5rem] border-2 border-ink/10 bg-sand-100 shadow-pop-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:min-h-[420px]"
            >
              <img
                src={FEATURED_IMAGE}
                alt="Ramo romántico pastel tejido a mano"
                loading="eager"
                decoding="async"
                width={800}
                height={1000}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 ease-artisan group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
              />

              <span className="absolute left-5 top-5 rounded-md border border-dashed border-clay bg-clay-soft/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-clay-deep shadow-sm backdrop-blur-sm">
                Pieza destacada
              </span>

              <div className="relative mt-auto w-full p-6 text-white sm:p-8">
                <p className="font-display text-[1.8rem] font-semibold leading-[1.05] sm:text-[2.4rem]">
                  Ramo romántico pastel
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-white/95">
                  Ver los diseños
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-240 ease-artisan group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>

            {/* Ficha sin cajas: dos columnas separadas por un filo. La paleta
             * enlaza a la carta completa; repetir aqui la invitacion a elegir
             * un tono sobraba porque ese es justo el trabajo del enlace. */}
            <div className="mt-6 grid grid-cols-2 gap-6 border-t-2 border-ink/10 pt-5 sm:gap-8">
              <a
                href="#carta-color"
                className="group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-clay-deep">
                  <Palette className="h-4 w-4" aria-hidden="true" />
                  Carta de color
                </p>

                <div className="mt-3 flex -space-x-1.5" aria-hidden="true">
                  {HERO_SWATCHES.map((swatch) => (
                    <span
                      key={swatch.name}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className="h-8 w-8 rounded-full border-2 border-canvas shadow-sm"
                    />
                  ))}
                </div>

                <p className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.12em] text-lila-800">
                  {colorCatalog.brands.length} marcas · {TOTAL_TONES} tonos
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-240 ease-artisan group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </p>
              </a>

              <div className="border-l border-ink/10 pl-6 sm:pl-8">
                <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-clay-deep">
                  <Scissors className="h-4 w-4" aria-hidden="true" />
                  Hecho a mano
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                  Cada pieza la tejo yo, desde Pachuca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
