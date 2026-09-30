/**
 * Navbar.jsx
 * -----------------------------------------------------------------------------
 * Cabecera fija (sticky) con la identidad de la marca, el acceso rapido a las
 * secciones de la landing y los enlaces a redes. Muestra el nombre "MANUALIDADES
 * LUA", el eslogan y el perfil de Instagram. En moviles se compacta (sin
 * navegacion) para no robar espacio al catalogo.
 * -----------------------------------------------------------------------------
 */

import { Instagram } from 'lucide-react'
import { BRAND, SECTIONS, SOCIAL_LINKS } from '../config/site'

/** Mapa de iconos por id de red social. */
const SOCIAL_ICONS = {
  instagram: Instagram,
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Identidad de la marca */}
        <a
          href="#inicio"
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label={`${BRAND.name} - ir al inicio`}
        >
          {/* Logotipo real de la marca */}
          <img
            src={BRAND.logo.src}
            width={BRAND.logo.width}
            height={BRAND.logo.height}
            alt={BRAND.logo.alt}
            className="h-11 w-11 shrink-0 object-contain transition-transform duration-300 ease-artisan group-hover:scale-105 sm:h-12 sm:w-12"
            onError={(event) => {
              // Si el WebP no esta disponible, se usa el PNG equivalente.
              event.currentTarget.src = BRAND.logo.fallback
            }}
          />

          <span className="min-w-0">
            <span className="block truncate font-display text-base font-semibold leading-tight tracking-[0.18em] text-ink transition-colors group-hover:text-lila-800 sm:text-lg md:tracking-[0.22em]">
              {BRAND.name}
            </span>
            <span className="hidden truncate text-[11px] font-medium tracking-wide text-ink-muted sm:block sm:text-xs">
              {BRAND.tagline}
            </span>
          </span>
        </a>

        {/* Navegacion de secciones: solo desde tablet, en movil no cabe sin
         * tapar el catalogo. El href usa los mismos ids que las secciones. */}
        <nav
          aria-label="Secciones"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors duration-300 ease-artisan hover:bg-lila-50 hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas lg:px-4 lg:text-[15px]"
            >
              {label}
            </a>
          ))}
        </nav>

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
                className="group flex items-center gap-2 rounded-full border border-line bg-surface px-2.5 py-2 text-ink-soft shadow-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-800 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-3.5"
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
