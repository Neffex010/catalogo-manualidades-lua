/**
 * ColorSwatchPicker.jsx
 * -----------------------------------------------------------------------------
 * Selector de color para los estambres.
 *
 * Cada boton es una muestra circular pintada con `hexColor`. Dentro se pinta el
 * codigo de color (01, 06, 07...) para que la eleccion sea inequivoca incluso
 * entre tonos parecidos. La variante activa lleva un anillo oscuro de 2px.
 *
 * Los productos con muchos tonos arrancan colapsados (`N + resto`). Si el padre
 * entrega `onShowAll`, ese boton abre la ficha completa (modal) en lugar de
 * estirar la tarjeta: asi la paleta de 47 tonos no empuja el resto del catalogo.
 * Sin `onShowAll` se conserva el comportamiento de expandir/contraer en sitio.
 *
 * En modo `compact` (tarjetas de dos columnas) las muestras bajan de tamano y
 * pierden el codigo pintado dentro: el codigo del tono activo ya aparece en la
 * linea "Tono" de la tarjeta y la ficha mantiene la paleta con codigos, plegada
 * a tres filas.
 *
 * Es un componente controlado: no guarda la variante activa. El producto dueño
 * de la tarjeta decide cual es y reacciona al cambio.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FALLBACK_SWATCH, isLightColor } from '../utils/color'
import { AVAILABILITY, getVariantStatus } from '../utils/availability'

/** Cuantas muestras se ven antes de ofrecer el resto. */
const DEFAULT_VISIBLE = 5

/**
 * @param {object} props
 * @param {Array<{
 *   id: string,
 *   colorCode: string,
 *   colorName: string,
 *   hexColor?: string | null,
 *   stock?: number | null
 * }>} props.variants
 * @param {string|null} props.activeVariantId
 * @param {(variantId: string) => void} props.onChange
 * @param {number} [props.maxVisible]
 * @param {() => void} [props.onShowAll] Cuando existe, el boton "+N" delega en el padre
 * @param {boolean} [props.compact] Muestras mas pequenas y sin codigo pintado
 */
export default function ColorSwatchPicker({
  variants = [],
  activeVariantId = null,
  onChange,
  maxVisible = DEFAULT_VISIBLE,
  onShowAll,
  compact = false,
}) {
  const [expanded, setExpanded] = useState(false)

  // Si el producto cambia (o se reduce el limite) se vuelve al estado compacto.
  useEffect(() => {
    setExpanded(false)
  }, [variants, maxVisible])

  if (variants.length === 0) return null

  const hasOverflow = variants.length > maxVisible
  const activeIndex = variants.findIndex((variant) => variant.id === activeVariantId)

  // Al colapsar, la ultima muestra visible se cede a la variante activa si esta
  // quedaria escondida. Asi el anillo de seleccion siempre tiene referente.
  const visibleVariants = (() => {
    if (expanded || !hasOverflow) return variants

    const head = variants.slice(0, maxVisible)
    if (activeIndex >= maxVisible) {
      head[maxVisible - 1] = variants[activeIndex]
    }
    return head
  })()

  const showAll = Boolean(onShowAll)

  // Compacto = tarjeta en dos columnas: las muestras deben caber junto al chip
  // "+N" incluso a 320 px, donde el hueco util ronda 114 px. En la ficha (sin
  // compacto) las muestras crecen para elegir el tono con comodidad; la paleta
  // se pliega a tres filas y el chip "+N" abre el resto sin estirar el modal.
  const swatchSize = compact
    ? 'h-6 w-6 text-[9px] min-[360px]:h-7 min-[360px]:w-7 min-[400px]:h-8 min-[400px]:w-8 sm:h-9 sm:w-9 sm:text-[10px] lg:h-11 lg:w-11 lg:text-[11px]'
    : 'h-9 w-9 text-[10px] min-[360px]:h-10 min-[360px]:w-10 sm:text-[11px]'

  return (
    <div>
      <div
        role="group"
        aria-label="Seleccionar tono"
        className="flex flex-wrap items-center gap-1 min-[360px]:gap-1.5 lg:gap-2"
      >
        {visibleVariants.map((variant) => {
          const isActive = variant.id === activeVariantId
          // Solo se bloquea un color marcado como agotado. Sin dato de stock,
          // el color se puede elegir y la tarjeta invita a confirmar.
          const isSoldOut = getVariantStatus(variant) === AVAILABILITY.SOLD_OUT
          const swatchColor = variant.hexColor || FALLBACK_SWATCH
          const textColor = isLightColor(swatchColor) ? '#2C2A29' : '#FFFFFF'
          const label = `Tono ${variant.colorCode} ${variant.colorName}`

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onChange?.(variant.id)}
              disabled={isSoldOut}
              aria-pressed={isActive}
              aria-label={`${label}${isSoldOut ? ' (agotado)' : ''}`}
              title={`${label}${isSoldOut ? ' · Agotado' : ''}`}
              style={{ backgroundColor: swatchColor }}
              className={[
                'relative grid shrink-0 place-items-center rounded-full border border-black/10 font-bold uppercase shadow-[inset_0_1px_3px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(44,42,41,0.10)] transition-all duration-160 ease-artisan',
                swatchSize,
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                isActive
                  ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface'
                  : 'hover:-translate-y-0.5 hover:shadow-md',
                isSoldOut ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              {!compact && <span style={{ color: textColor }}>{variant.colorCode}</span>}

              {/* Tachado sutil para los colores sin stock */}
              {isSoldOut && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  <span className="block h-px w-3/4 rotate-45 bg-ink/80" />
                </span>
              )}
            </button>
          )
        })}

        {hasOverflow && (
          <button
            type="button"
            onClick={showAll ? onShowAll : () => setExpanded((value) => !value)}
            aria-expanded={showAll ? undefined : expanded}
            aria-label={
              showAll
                ? `Ver los ${variants.length} tonos`
                : expanded
                  ? 'Mostrar menos tonos'
                  : `Mostrar los ${variants.length} tonos`
            }
            title={
              showAll || !expanded ? `Ver los ${variants.length} tonos` : 'Mostrar menos'
            }
            className={[
              'inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full border border-dashed border-ink/25 bg-sand-50 font-bold tabular-nums text-ink-soft transition-all duration-160 ease-artisan hover:border-lila-400 hover:bg-surface hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
              swatchSize,
            ].join(' ')}
          >
            {expanded && !showAll ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <>
                +{variants.length - maxVisible}
                {!compact && (
                  <ChevronDown className="h-3 w-3 opacity-60" aria-hidden="true" />
                )}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
