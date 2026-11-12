/**
 * Hero.jsx
 * -----------------------------------------------------------------------------
 * Portada tipo Bento editorial.
 *
 * En lugar de un bloque centrado generico, la primera pantalla combina cuatro
 * piezas: identidad + propuesta de valor, una pieza del portafolio, la carta de
 * color de estambres/hilos y el sello "hecho a mano". La retícula asimetrica
 * separa las dos intenciones del sitio: encargar un diseno o comprar material.
 * -----------------------------------------------------------------------------
 */

import { ArrowRight, Gift, Heart, Palette, Scissors, Sparkles } from 'lucide-react'
import { BRAND } from '../config/site'

/** Pilares de la marca mostrados bajo el eslogan. */
const HIGHLIGHTS = [
  { icon: Gift, label: 'Hecho por encargo' },
  { icon: Palette, label: 'Hilos y estambres' },
  { icon: Heart, label: 'Piezas únicas' },
]

/**
 * Muestra de la carta de color. Son los tonos que abren la coleccion de
 * estambres e hilos; se pintan como muestras fisicas para que el hero comunique
 * de inmediato que el catalogo ya no es solo de manualidades.
 */
const HERO_SWATCHES = [
  { name: 'Blanco', hex: '#F8F5EF' },
  { name: 'Cielo', hex: '#A9D6E5' },
  { name: 'Vidrio', hex: '#B8C9C5' },
  { name: 'Lila', hex: '#B79EE6' },
  { name: 'Rosa', hex: '#E7A6B8' },
  { name: 'Rojo', hex: '#B9373F' },
]

/** Foto de la pieza destacada. */
const FEATURED_IMAGE = '/images/catalogo/flores/ramo-romantico-pastel-luces.jpg'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-line/70 bg-canvas"
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

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-stretch gap-4 lg:grid-cols-12">
          {/* --------------------------------------------------------------
           * Tile principal: marca y propuesta de valor
           * ------------------------------------------------------------ */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-4xl border border-line bg-surface/90 p-6 shadow-soft sm:p-9 lg:col-span-7 lg:p-10">
            <div>
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

              <h1 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Diseños tejidos a pedido
                <span className="mt-1 block text-lila-700">
                  y los hilos para crear los tuyos
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
                Amigurumis, flores, recuerdos y llaveros hechos a mano por encargo. Elige un
                diseño del portafolio o llévate los hilos y estambres para tu propio proyecto.
              </p>
            </div>

            <div className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#disenos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-lila-800 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Ver diseños
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#materiales"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-sand-50 px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-surface hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <Palette className="h-4 w-4" aria-hidden="true" />
                  Ver materiales
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[11px] font-medium text-ink-muted sm:text-xs">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-lila-600" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --------------------------------------------------------------
           * Columna derecha: pieza destacada + carta de color + sello
           * ------------------------------------------------------------ */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <a
              href="#disenos"
              className="group relative flex min-h-[280px] flex-1 overflow-hidden rounded-4xl border border-line bg-sand-100 shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:min-h-[320px]"
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
                className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
              />

              <span className="absolute left-4 top-4 rounded-full bg-surface/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-lila-800 shadow-soft backdrop-blur-sm sm:left-5 sm:top-5">
                Pieza destacada
              </span>

              <div className="relative mt-auto w-full p-5 text-white sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Portafolio
                </p>
                <p className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">
                  Ramo romántico pastel
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  Ver los diseños
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-240 ease-artisan group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="#materiales"
                className="group flex flex-col justify-between rounded-4xl border border-line bg-sand-50 p-4 transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:border-lila-300 hover:bg-surface hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-5"
              >
                <div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lila-100 text-lila-800">
                    <Palette className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-display text-base font-semibold text-ink sm:text-lg">
                    Carta de color
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-muted sm:text-xs">
                    Elige el tono exacto para tu proyecto.
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex -space-x-1.5" aria-hidden="true">
                    {HERO_SWATCHES.map((swatch) => (
                      <span
                        key={swatch.name}
                        title={swatch.name}
                        style={{ backgroundColor: swatch.hex }}
                        className="h-6 w-6 rounded-full border-2 border-surface shadow-sm sm:h-7 sm:w-7"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-lila-800">
                    Estambres e hilos
                  </p>
                </div>
              </a>

              <div className="flex flex-col justify-between rounded-4xl border border-lila-300/70 bg-lila-100/70 p-4 sm:p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-lila-800">
                  <Scissors className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="mt-3">
                  <p className="font-display text-base font-semibold text-ink sm:text-lg">
                    Hecho a mano
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-soft sm:text-xs">
                    Cada pieza se teje una por una, sin prisas.
                  </p>
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-lila-800">
                  Desde Pachuca, Hgo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
