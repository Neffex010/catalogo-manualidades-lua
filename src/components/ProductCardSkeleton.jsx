/**
 * ProductCardSkeleton.jsx
 * -----------------------------------------------------------------------------
 * Esqueleto de carga que imita la estructura de ProductCard.
 * Evita el "salto" de layout cuando los productos terminan de cargar.
 *
 * `variant="design"` reproduce la tarjeta sin caja del portafolio (solo foto y
 * pie editorial); el valor por defecto imita la tarjeta de materiales.
 * -----------------------------------------------------------------------------
 */

export default function ProductCardSkeleton({ variant = 'material' }) {
  const isDesign = variant === 'design'

  return (
    <div
      aria-hidden="true"
      className={
        isDesign
          ? 'flex h-full flex-col'
          : 'flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface'
      }
    >
      {/* Bloque de imagen */}
      <div
        className={[
          'relative aspect-4/5 w-full overflow-hidden bg-sand-100',
          isDesign ? 'rounded-[1.25rem]' : '',
        ].join(' ')}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Franja del color activo (misma altura que en ProductCard) */}
      {!isDesign && <div className="h-1.5 w-full bg-sand-100" />}

      {/* Bloque de texto */}
      <div
        className={
          isDesign
            ? 'flex flex-1 flex-col pt-3'
            : 'flex flex-1 flex-col p-4 sm:p-5'
        }
      >
        <div className="h-5 w-3/4 rounded-full bg-sand-100" />
        <div className="mt-3 h-3.5 w-full rounded-full bg-sand-100" />
        <div className="mt-2 h-3.5 w-5/6 rounded-full bg-sand-100" />
        <div className="mt-2 h-3.5 w-2/3 rounded-full bg-sand-100" />

        {!isDesign && (
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-sand-100" />
            <div className="h-6 w-16 rounded-full bg-sand-100" />
          </div>
        )}

        <div className="flex-1" />

        <div
          className={
            isDesign
              ? 'mt-5 h-10 w-full border-t-2 border-ink/10 bg-sand-100/60'
              : 'mt-5 h-[52px] w-full rounded-xl bg-sand-100'
          }
        />
      </div>
    </div>
  )
}
