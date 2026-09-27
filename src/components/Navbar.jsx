/**
 * Navbar.jsx
 * -----------------------------------------------------------------------------
 * Cabecera fija (sticky) con la identidad de la marca y los enlaces a redes.
 * Muestra el nombre "MANUALIDADES LUA", el eslogan y los perfiles de Instagram
 * y Facebook. En moviles se compacta para no robar espacio al catalogo.
 * -----------------------------------------------------------------------------
 */

import { Instagram, Facebook, Sparkles } from 'lucide-react'
import { BRAND, SOCIAL_LINKS } from '../config/site'

/** Mapa de iconos por id de red social. */
const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Identidad de la marca */}
        <a
          href="#inicio"
          className="group flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label={`${BRAND.name} - ir al inicio`}
        >
          {/* Emblema de madeja */}
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-brand transition-transform duration-300 ease-artisan group-hover:scale-105 sm:h-12 sm:w-12">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </span>

          <span className="min-w-0">
            <span className="block truncate font-display text-base font-semibold leading-tight tracking-[0.18em] text-ink transition-colors group-hover:text-lila-700 sm:text-lg md:tracking-[0.22em]">
              {BRAND.name}
            </span>
            <span className="hidden truncate text-[11px] font-medium tracking-wide text-ink-muted sm:block sm:text-xs">
              {BRAND.tagline}
            </span>
          </span>
        </a>

        {/* Redes sociales */}
        <nav aria-label="Redes sociales" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {SOCIAL_LINKS.map(({ id, label, handle, href }) => {
            const Icon = SOCIAL_ICONS[id]
            return (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${label}: ${handle}`}
                aria-label={`${label} de Manualidades Lua (${handle})`}
                className="group flex items-center gap-2 rounded-full border border-line bg-surface px-2.5 py-2 text-ink-soft shadow-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-700 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-3.5"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span className="hidden text-xs font-medium lg:inline">{handle}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
