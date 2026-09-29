/**
 * Footer.jsx
 * -----------------------------------------------------------------------------
 * Pie de pagina: identidad de marca, redes sociales y llamada a la accion
 * para cotizaciones por WhatsApp.
 * -----------------------------------------------------------------------------
 */

import { Instagram, Facebook, MessageCircle, Heart } from 'lucide-react'
import { BRAND, SOCIAL_LINKS, WHATSAPP_NUMBER } from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contacto"
      className="mt-20 scroll-mt-24 border-t border-line bg-surface sm:mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Llamada a la accion */}
        <div className="relative overflow-hidden rounded-3xl bg-lila-600 px-6 py-10 text-center shadow-lift sm:px-10 sm:py-14">
          {/* Textura decorativa */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative">
            <h2 className="font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
              ¿Tienes una idea en mente? 🧶
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Trabajamos bajo pedido: colores, tamaños, nombres bordados y piezas únicas. Cuéntanos qué
              te gustaría y te cotizamos sin compromiso.
            </p>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-lila-700 shadow-card transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:bg-lila-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lila-600 sm:text-base"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
              Cotizar por WhatsApp
            </a>
          </div>
        </div>

        {/* Marca y redes */}
        <div className="mt-12 flex flex-col items-center gap-8 text-center sm:mt-14">
          <div>
            <div className="flex items-center justify-center gap-3">
              <img
                src={BRAND.logo.mark}
                width={BRAND.logo.width}
                height={BRAND.logo.height}
                alt={BRAND.logo.alt}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 object-contain"
                onError={(event) => {
                  event.currentTarget.src = BRAND.logo.fallback
                }}
              />
              <p className="font-display text-lg font-semibold tracking-[0.18em] text-ink">
                {BRAND.name}
              </p>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{BRAND.tagline}</p>
          </div>

          <nav aria-label="Redes sociales" className="flex flex-wrap items-center justify-center gap-3">
            {SOCIAL_LINKS.map(({ id, label, handle, href }) => {
              const Icon = SOCIAL_ICONS[id]
              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} de Manualidades Lua (${handle})`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2.5 text-xs font-semibold text-ink-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:text-sm"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {handle}
                </a>
              )
            })}
          </nav>

          <p className="text-xs text-ink-muted">
            WhatsApp: <span className="font-semibold text-ink-soft">+{WHATSAPP_NUMBER}</span>
          </p>
        </div>

        {/* Linea de copyright */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-line pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-ink-muted">
            © {year} {BRAND.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            Hecho con <Heart className="h-3.5 w-3.5 text-brand" aria-hidden="true" /> y mucho hilo
          </p>
        </div>
      </div>
    </footer>
  )
}
