/**
 * Navbar.jsx
 * -----------------------------------------------------------------------------
 * Cabecera fija (sticky) con la identidad de la marca, la navegacion de las
 * cuatro secciones y un acceso directo a WhatsApp.
 *
 * En escritorio todo vive en una fila. En movil la navegacion baja a una
 * segunda fila compacta y desplazable: las secciones siguen a un toque sin
 * robarte el ancho del logotipo ni del boton de cotizar. Las redes sociales ya
 * no viven aqui: su lugar es la seccion Tienda, junto al resto del contacto.
 * -----------------------------------------------------------------------------
 */

import { MessageCircle } from 'lucide-react'
import { BRAND, SECTIONS } from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        {/* Identidad de la marca */}
        <a
          href="#inicio"
          className="group order-1 flex min-w-0 shrink items-center gap-2.5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label={`${BRAND.name} - ir al inicio`}
        >
          {/* Logotipo real de la marca */}
          <img
            src={BRAND.logo.src}
            width={BRAND.logo.width}
            height={BRAND.logo.height}
            alt={BRAND.logo.alt}
            className="h-10 w-10 shrink-0 object-contain transition-transform duration-300 ease-artisan group-hover:scale-105 sm:h-12 sm:w-12"
            onError={(event) => {
              // Si el WebP no esta disponible, se usa el PNG equivalente.
              event.currentTarget.src = BRAND.logo.fallback
            }}
          />

          <span className="min-w-0">
            <span className="block truncate font-display text-[13px] font-semibold leading-tight tracking-[0.08em] text-ink transition-colors group-hover:text-lila-800 sm:text-lg sm:tracking-[0.18em] md:tracking-[0.22em]">
              {BRAND.name}
            </span>
            <span className="hidden truncate text-[11px] font-medium tracking-wide text-ink-muted sm:block sm:text-xs">
              {BRAND.tagline}
            </span>
          </span>
        </a>

        {/* Accion principal: cotizar por WhatsApp. En pantallas muy angostas
            queda solo el icono (con aria-label) para no partir la cabecera. */}
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-2.5 py-2 text-xs font-semibold text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-lila-800 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas min-[360px]:px-3.5 md:order-3 sm:px-4 sm:py-2.5 sm:text-sm"
          aria-label="Cotizar por WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden min-[360px]:inline">Cotizar</span>
        </a>

        {/* Navegacion: segunda fila en movil, centrada en escritorio */}
        <nav
          aria-label="Secciones"
          className="no-scrollbar order-3 flex w-full items-center gap-1 overflow-x-auto pb-0.5 md:order-2 md:w-auto md:flex-1 md:justify-center md:overflow-visible md:pb-0"
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors duration-240 ease-artisan hover:bg-sand-50 hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:px-3 md:px-3.5 md:py-2 md:text-sm lg:px-4 lg:text-[15px]"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
