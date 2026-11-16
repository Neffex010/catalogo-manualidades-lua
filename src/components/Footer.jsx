/**
 * Footer.jsx
 * -----------------------------------------------------------------------------
 * Cierre de la pagina: llamada final a WhatsApp, identidad de marca, accesos
 * rapidos y aviso legal.
 *
 * Los datos completos de la tienda (direccion, horario, telefono y redes) viven
 * en `StoreInfo`, justo arriba. Repetirlos aqui alargaba la pagina sin aportar
 * informacion nueva.
 * -----------------------------------------------------------------------------
 */

import { Heart, MessageCircle } from 'lucide-react'
import { BRAND, SECTIONS } from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

export default function Footer() {
  const year = new Date().getFullYear()
  const quickLinks = SECTIONS.filter(({ id }) => id !== 'inicio')

  return (
    <footer className="mt-4 border-t border-line bg-surface sm:mt-8">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Llamada final a la accion */}
        <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-ink bg-brand px-6 py-12 text-center shadow-pop sm:px-10 sm:py-16">
          {/* Puntada interior: guiño a la costura sin sumar peso visual */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-[1rem] border-2 border-dashed border-white/25 sm:inset-4"
          />
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
            <h2 className="font-display text-[2.1rem] font-semibold leading-[1.02] text-white sm:text-[2.8rem]">
              ¿Tienes una idea en mente? 🧶
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-white sm:text-[17px]">
              Cuéntame qué quieres crear y te cotizo sin compromiso.
            </p>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-white px-7 py-4 text-[15px] font-bold text-lila-800 shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-sand-50 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand sm:text-base"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
              Escríbeme por WhatsApp
            </a>
          </div>
        </div>

        {/* Identidad y accesos rapidos */}
        <div className="mt-10 flex flex-col items-center gap-6 text-center sm:mt-12 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src={BRAND.logo.mark}
              width={BRAND.logo.width}
              height={BRAND.logo.height}
              alt={BRAND.logo.alt}
              loading="lazy"
              decoding="async"
              className="h-11 w-11 object-contain"
              onError={(event) => {
                // Es la version `mark` (recorte compacto), asi que su
                // respaldo es `markFallback` y no el logo completo.
                event.currentTarget.src = BRAND.logo.markFallback
              }}
            />
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.18em] text-ink">
                {BRAND.name}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-soft">{BRAND.tagline}</p>
            </div>
          </div>

          <nav aria-label="Enlaces del pie" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {quickLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="link-rule py-1 text-[12px] font-semibold text-ink-soft transition-colors duration-160 ease-artisan hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-[13px]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Linea de copyright */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-line pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[13px] text-ink-muted">
            © {year} {BRAND.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
            Hecho con <Heart className="h-3.5 w-3.5 text-brand" aria-hidden="true" /> y mucho hilo
          </p>
        </div>
      </div>
    </footer>
  )
}
