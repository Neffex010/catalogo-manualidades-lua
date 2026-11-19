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
import { Check, MessageCircle, Minus, Plus, X } from 'lucide-react'
import colorCatalog from '../data/colorCatalog.json'
import { getColorWhatsAppUrl } from '../utils/whatsapp'
import { YarnBallIcon } from './CrochetMotifs'

/** Tonos visibles antes de ofrecer "Ver todos". */
const INITIAL_VISIBLE = 6

export default function ColorCatalog() {
  const brands = colorCatalog.brands
  const [activeId, setActiveId] = useState(brands[0]?.id ?? '')
  const [expandedByBrand, setExpandedByBrand] = useState({})
  // Un tono no se pide al tocarlo: se elige y la barra de abajo confirma.
  const [selectedCode, setSelectedCode] = useState(null)

  const activeBrand = brands.find((brand) => brand.id === activeId) ?? brands[0]

  if (!activeBrand) return null

  const selectedColor =
    activeBrand.colors.find((color) => color.code === selectedCode) ?? null

  const isExpanded = Boolean(expandedByBrand[activeBrand.id])
  const hiddenCount = Math.max(0, activeBrand.colors.length - INITIAL_VISIBLE)

  const visibleColors = isExpanded
    ? activeBrand.colors
    : activeBrand.colors.slice(0, INITIAL_VISIBLE)

  const handleBrandChange = (brandId) => {
    setActiveId(brandId)
    // Al cambiar de marca se vuelve al estado compacto y se suelta el tono.
    setExpandedByBrand({})
    setSelectedCode(null)
  }

  // Al quitar el resumen con la X, el foco regresa al tono que lo abrio en
  // lugar de perderse con el boton que desaparece.
  const handleClearSelection = () => {
    const toneCode = selectedCode
    setSelectedCode(null)
    if (toneCode) {
      document
        .getElementById(`carta-tono-${activeBrand.id}-${toneCode}`)
        ?.focus()
    }
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
      className="relative mt-7 pt-5 sm:mt-10 sm:pt-6"
    >
      <div
        aria-hidden="true"
        className="stitch-rule absolute inset-x-0 top-0 text-ink/20"
      />
      <div className="max-w-2xl">
        <h3
          id="carta-color-titulo"
          className="flex items-center gap-2.5 font-display text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
        >
          <YarnBallIcon className="h-6 w-6 shrink-0 text-clay sm:h-8 sm:w-8" />
          Todos los tonos
        </h3>
        <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-soft sm:text-[15px]">
          Elige una marca y toca un tono. Revisa el resumen y pide por WhatsApp.
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
        className="texture-knit mt-4 rounded-2xl border border-line bg-surface p-4 shadow-rest sm:p-5"
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
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line bg-sand-50 px-4 py-2 text-[12.5px] font-semibold text-ink-soft transition-colors duration-160 ease-artisan hover:border-clay/50 hover:text-clay-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
            const isSelected = color.code === selectedCode
            // Etiqueta estable (APG): `aria-pressed` comunica si esta elegido.
            const actionLabel = `Elegir ${activeBrand.name} tono ${colorLabel}`

            return (
              <li
                key={`${activeBrand.id}-${color.code}`}
                // En movil se ve una sola fila de 3: la carta se hojea sin
                // empujar la seccion. Desde `sm` se muestran las 6.
                className={['min-w-0', index >= 3 ? 'hidden sm:block' : ''].join(' ')}
              >
                <button
                  id={`carta-tono-${activeBrand.id}-${color.code}`}
                  type="button"
                  onClick={() =>
                    setSelectedCode((current) =>
                      current === color.code ? null : color.code
                    )
                  }
                  aria-pressed={isSelected}
                  aria-label={actionLabel}
                  title={actionLabel}
                  className="group block w-full rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <span
                    className={[
                      'relative block aspect-square overflow-hidden rounded-xl border bg-sand-100 transition-all duration-160 ease-artisan',
                      isSelected
                        ? 'border-clay ring-2 ring-clay ring-offset-2 ring-offset-surface'
                        : 'border-line/80 group-hover:border-clay/60',
                    ].join(' ')}
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
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-clay-deep text-white shadow-soft"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </span>
                    )}
                  </span>

                  <span className="mt-2 flex items-baseline gap-1.5 text-[12px] leading-tight">
                    <span className="font-mono font-bold tabular-nums text-clay-deep">
                      {color.code}
                    </span>
                    {color.name && (
                      <span className="truncate text-ink-soft">{color.name}</span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Confirmacion: el tono elegido y un unico CTA. La barra se queda a la
         * vista al recorrer la paleta completa, sin abrir otra capa. */}
        {selectedColor && (
          <div className="sticky bottom-3 z-10 mt-4 flex flex-col gap-3 rounded-xl border border-clay/40 bg-sand-50 p-3 shadow-pop sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={selectedColor.image}
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-lg border border-line object-cover"
              />
              <p role="status" className="min-w-0">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-clay-deep">
                  Tono elegido
                </span>{' '}
                <span className="mt-0.5 block truncate text-[13.5px] font-semibold text-ink">
                  {selectedColor.code}
                  {selectedColor.name ? ` · ${selectedColor.name}` : ''} ·{' '}
                  {activeBrand.name}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getColorWhatsAppUrl(activeBrand, selectedColor)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-stitch inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand px-4 py-2.5 text-[13.5px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lila-800 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 sm:flex-none"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Pedir por WhatsApp
              </a>
              <button
                type="button"
                onClick={handleClearSelection}
                aria-label="Quitar el tono elegido"
                title="Quitar el tono elegido"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-dashed border-line bg-surface text-ink-muted transition-colors duration-160 ease-artisan hover:border-clay/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 border-t border-line/70 pt-3 text-[12px] leading-relaxed text-ink-muted">
          Los tonos pueden variar según la pantalla.
        </p>
      </div>
    </section>
  )
}
