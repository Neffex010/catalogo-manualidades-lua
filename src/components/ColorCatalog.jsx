/**
 * ColorCatalog.jsx
 * -----------------------------------------------------------------------------
 * Carta de color de la tienda.
 *
 * Presenta las marcas reales de `assets/` con una muestra de cada tono, sin
 * precio ni stock: es una referencia visual, no un producto a la venta.
 *
 * Para no saturar: una marca a la vez, 6 tonos visibles y un boton para ver
 * el resto. El grid es de 6 columnas en escritorio, 4 en tablet y 3 en movil,
 * asi que las primeras 6 muestras forman dos filas exactas en movil y una en
 * escritorio. Los conteos salen del manifiesto generado por `npm run colors`.
 * -----------------------------------------------------------------------------
 */

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import colorCatalog from '../data/colorCatalog.json'
import { getColorWhatsAppUrl } from '../utils/whatsapp'

/** Tonos visibles antes de ofrecer "Ver todos". */
const INITIAL_VISIBLE = 6

export default function ColorCatalog() {
  const brands = colorCatalog.brands
  const [activeId, setActiveId] = useState(brands[0]?.id ?? '')
  const [expandedByBrand, setExpandedByBrand] = useState({})

  const activeBrand = brands.find((brand) => brand.id === activeId) ?? brands[0]

  if (!activeBrand) return null

  const isExpanded = Boolean(expandedByBrand[activeBrand.id])
  const hiddenCount = Math.max(0, activeBrand.colors.length - INITIAL_VISIBLE)

  const visibleColors = isExpanded
    ? activeBrand.colors
    : activeBrand.colors.slice(0, INITIAL_VISIBLE)

  const handleBrandChange = (brandId) => {
    setActiveId(brandId)
    // Al cambiar de marca se vuelve al estado compacto.
    setExpandedByBrand({})
  }

  const toggleExpanded = () => {
    setExpandedByBrand((current) => ({
      ...current,
      [activeBrand.id]: !current[activeBrand.id],
    }))
  }

  return (
    <section
      id="carta-color"
      aria-labelledby="carta-color-titulo"
      className="mt-7 border-t-2 border-ink/15 pt-5 sm:mt-10 sm:pt-6"
    >
      <div className="max-w-2xl">
        <h3
          id="carta-color-titulo"
          className="font-display text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
        >
          Todos los tonos
        </h3>
        <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-soft sm:text-[15px]">
          Elige una marca y toca el tono para pedirlo por WhatsApp.
        </p>
      </div>

      {/* Pestañas de marca: la activa se marca con el acento terracota. Se
       * envuelven en varias filas para que ninguna marca quede cortada. */}
      <div
        role="tablist"
        aria-label="Marcas de la carta de color"
        className="mt-5 flex flex-wrap gap-x-1 border-b-2 border-ink/10"
      >
        {brands.map((brand) => {
          const isActive = brand.id === activeBrand.id

          return (
            <button
              key={brand.id}
              id={`carta-tab-${brand.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="carta-color-panel"
              onClick={() => handleBrandChange(brand.id)}
              className={[
                '-mb-[2px] inline-flex shrink-0 items-center gap-2 border-b-[3px] px-3 py-2.5 text-[13px] font-semibold transition-colors duration-160 ease-artisan focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:text-[14px]',
                isActive
                  ? 'border-clay text-ink'
                  : 'border-transparent text-ink-muted hover:border-line hover:text-ink',
              ].join(' ')}
            >
              {brand.name}
              <span
                className={[
                  'font-mono text-[11px] font-bold tabular-nums',
                  isActive ? 'text-clay-deep' : 'text-ink-muted/70',
                ].join(' ')}
              >
                {brand.colors.length}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="carta-color-panel"
        role="tabpanel"
        aria-labelledby={`carta-tab-${activeBrand.id}`}
        className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-rest sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12.5px] font-semibold text-ink-muted">
            {activeBrand.type}
          </p>

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-sand-50 px-4 py-2 text-[12.5px] font-semibold text-ink-soft transition-colors duration-160 ease-artisan hover:border-clay/50 hover:text-clay-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {isExpanded ? (
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isExpanded ? 'Ver menos' : `Ver los ${activeBrand.colors.length} tonos`}
            </button>
          )}
        </div>

        <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 md:grid-cols-6">
          {visibleColors.map((color, index) => {
            const colorLabel = color.name ? `${color.code} ${color.name}` : color.code
            const orderLabel = `Pedir ${activeBrand.name} tono ${colorLabel} por WhatsApp`

            return (
              <li
                key={`${activeBrand.id}-${color.code}`}
                // En movil se ve una sola fila de 3: la carta se hojea sin
                // empujar la seccion. Desde `sm` se muestran las 6.
                className={['min-w-0', index >= 3 ? 'hidden sm:block' : ''].join(' ')}
              >
                <a
                  href={getColorWhatsAppUrl(activeBrand, color)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={orderLabel}
                  title={orderLabel}
                  className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <div
                    className="aspect-square overflow-hidden rounded-xl border border-line/80 bg-sand-100 transition-colors duration-160 ease-artisan group-hover:border-clay/60"
                    style={{ backgroundColor: color.hex }}
                  >
                    <img
                      src={color.image}
                      alt={`${activeBrand.name} ${color.name || `tono ${color.code}`}`}
                      width={320}
                      height={320}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-2 flex items-baseline gap-1.5 text-[12px] leading-tight">
                    <span className="font-mono font-bold tabular-nums text-clay-deep">
                      {color.code}
                    </span>
                    {color.name && (
                      <span className="truncate text-ink-soft">{color.name}</span>
                    )}
                  </p>
                </a>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 border-t border-line/70 pt-3 text-[12px] leading-relaxed text-ink-muted">
          Los tonos pueden variar según la pantalla.
        </p>
      </div>
    </section>
  )
}
