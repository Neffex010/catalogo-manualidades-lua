/**
 * ColorSwatchPicker.jsx
 * -----------------------------------------------------------------------------
 * Selector de color para estambres e hilos.
 *
 * Cada boton es una muestra circular pintada con `hexColor`. Dentro se pinta el
 * codigo de color (01, 06, 07...) para que la eleccion sea inequivoca incluso
 * entre tonos parecidos. La variante activa lleva un anillo oscuro de 2px.
 *
 * Los productos con muchos colores arrancan colapsados (`6 + N`) para que la
 * tarjeta no crezca mas que la foto. Si la variante activa queda fuera de la
 * primera tanda, se reserva un lugar para ella: el color elegido nunca
 * desaparece de la vista.
 *
 * Es un componente controlado: no guarda la variante activa. El producto dueño
 * de la tarjeta decide cual es y reacciona al cambio.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FALLBACK_SWATCH, isLightColor } from '../utils/color'
import { AVAILABILITY, getVariantStatus } from '../utils/availability'

/** Cuantas muestras se ven antes de ofrecer "ver todos". */
const DEFAULT_VISIBLE = 6

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
 */
export default function ColorSwatchPicker({
  variants = [],
  activeVariantId = null,
  onChange,
  maxVisible = DEFAULT_VISIBLE,
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

  return (
    <div>
      <div
        role="group"
        aria-label="Seleccionar color"
        className="flex flex-wrap items-center gap-2 sm:gap-2.5"
      >
        {visibleVariants.map((variant) => {
          const isActive = variant.id === activeVariantId
          // Solo se bloquea un color marcado como agotado. Sin dato de stock,
          // el color se puede elegir y la tarjeta invita a confirmar.
          const isSoldOut = getVariantStatus(variant) === AVAILABILITY.SOLD_OUT
          const swatchColor = variant.hexColor || FALLBACK_SWATCH
          const textColor = isLightColor(swatchColor) ? '#2C2A29' : '#FFFFFF'
          const label = `Color ${variant.colorCode} ${variant.colorName}`

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
                'relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 text-[11px] font-bold uppercase shadow-sm transition-all duration-160 ease-artisan sm:h-12 sm:w-12',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                isActive
                  ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface'
                  : 'hover:-translate-y-0.5 hover:shadow-md',
                isSoldOut ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              <span style={{ color: textColor }}>{variant.colorCode}</span>

              {/* Tachado sutil para los colores sin stock */}
              {isSoldOut && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  <span className="block h-px w-8 rotate-45 bg-ink/80" />
                </span>
              )}
            </button>
          )
        })}

        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? 'Mostrar menos colores'
                : `Mostrar los ${variants.length} colores`
            }
            title={expanded ? 'Mostrar menos' : `Ver los ${variants.length} colores`}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-line bg-sand-100 px-3 text-[12px] font-bold text-ink-soft transition-all duration-160 ease-artisan hover:border-lila-400 hover:bg-surface hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:h-12"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                Menos
              </>
            ) : (
              <>
                +{variants.length - maxVisible}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
