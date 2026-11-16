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
 *
 * Visual: filo de color superior, navegacion en versalitas con subrayado
 * progresivo y una sola accion solida (WhatsApp).
 * -----------------------------------------------------------------------------
 */

import { MessageCircle } from 'lucide-react'
import { BRAND, SECTIONS } from '../config/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

const SECTION_IDS = SECTIONS.map(({ id }) => id)

export default function Navbar() {
  const activeSection = useActiveSection(SECTION_IDS)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/15 bg-canvas/85 backdrop-blur-xl">
      {/* Filo de marca: reemplaza la sombra y separa la cabecera del papel. */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-gradient-to-r from-clay via-lila-500 to-sand-200"
      />

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
            className="h-9 w-9 shrink-0 object-contain transition-transform duration-300 ease-artisan group-hover:scale-105 sm:h-11 sm:w-11"
            onError={(event) => {
              // Si el WebP no esta disponible, se usa el PNG equivalente.
              event.currentTarget.src = BRAND.logo.fallback
            }}
          />

          <span className="min-w-0">
            <span className="block truncate font-display text-[14px] font-semibold leading-tight tracking-[0.08em] text-ink transition-colors group-hover:text-lila-800 sm:text-[18px] sm:tracking-[0.14em]">
              {BRAND.name}
            </span>
          </span>
        </a>

        {/* Accion principal: cotizar por WhatsApp. En pantallas muy angostas
            queda solo el icono (con aria-label) para no partir la cabecera. */}
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-ink bg-brand px-2.5 py-2 text-[13px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lila-800 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas min-[360px]:px-3.5 md:order-3 sm:px-4 sm:py-2.5 sm:text-[14px]"
          aria-label="Cotizar por WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden min-[360px]:inline">Cotizar</span>
        </a>

        {/* Navegacion: segunda fila en movil, centrada en escritorio */}
        <nav
          aria-label="Secciones"
          className="no-scrollbar order-3 flex w-full items-center gap-4 overflow-x-auto pb-1.5 md:order-2 md:ml-auto md:w-auto md:flex-none md:gap-5 md:overflow-visible md:pb-0 md:items-center lg:gap-7"
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
              className={[
                'link-rule shrink-0 py-1.5 text-[13px] font-semibold tracking-[0.01em] transition-colors duration-240 ease-artisan focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-[13.5px]',
                activeSection === id ? 'text-ink' : 'text-ink-soft hover:text-ink',
              ].join(' ')}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
