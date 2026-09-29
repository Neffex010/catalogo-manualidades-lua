/**
 * Hero.jsx
 * -----------------------------------------------------------------------------
 * Portada de la landing: propuesta de valor, eslogan de la marca y accesos
 * rapidos al catalogo y a la cotizacion por WhatsApp.
 * -----------------------------------------------------------------------------
 */

import { MessageCircle, Sparkles, Heart, Scissors } from 'lucide-react'
import { BRAND } from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

/** Pilares de la marca mostrados bajo el eslogan. */
const HIGHLIGHTS = [
  { icon: Scissors, label: 'Hecho a mano' },
  { icon: Sparkles, label: 'Personalizable' },
  { icon: Heart, label: 'Con mucho cariño' },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-line/60 bg-canvas"
    >
      {/* Decoracion de fondo: dos manchas suaves de color de marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lila-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-lila-300/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Logotipo de la marca */}
        <img
          src={BRAND.logo.mark}
          width={BRAND.logo.width}
          height={BRAND.logo.height}
          alt={BRAND.logo.alt}
          className="animate-fade-in-up mx-auto h-24 w-24 object-contain sm:h-32 sm:w-32"
          onError={(event) => {
            event.currentTarget.src = BRAND.logo.markFallback
          }}
        />

        {/* Eslogan de la marca */}
        <p
          className="animate-fade-in-up mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-lila-600 sm:text-sm"
          style={{ animationDelay: '80ms' }}
        >
          Manualidades Lua
        </p>

        <h1
          className="animate-fade-in-up mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '160ms' }}
        >
          Creaciones artesanales
          <span className="block text-lila-600">tejidas con amor 🧶</span>
        </h1>

        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
          style={{ animationDelay: '240ms' }}
        >
          {BRAND.shortDescription}
        </p>

        {/* Botones de accion */}
        <div
          className="animate-fade-in-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '320ms' }}
        >
          <a
            href="#catalogo"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-brand transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:bg-lila-700 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:w-auto"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Ver catálogo
          </a>

          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-ink shadow-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Cotizar por WhatsApp
          </a>
        </div>

        {/* Pilares de confianza */}
        <ul
          className="animate-fade-in-up mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-ink-muted sm:gap-x-10 sm:text-sm"
          style={{ animationDelay: '400ms' }}
        >
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-lila-500" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
