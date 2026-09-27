/**
 * ProductCardSkeleton.jsx
 * -----------------------------------------------------------------------------
 * Esqueleto de carga que imita la estructura de ProductCard.
 * Evita el "salto" de layout cuando los productos terminan de cargar.
 * -----------------------------------------------------------------------------
 */

export default function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft"
    >
      {/* Bloque de imagen */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-lila-100">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Bloque de texto */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="h-5 w-3/4 rounded-full bg-lila-100" />
        <div className="mt-3 h-3.5 w-full rounded-full bg-lila-100" />
        <div className="mt-2 h-3.5 w-5/6 rounded-full bg-lila-100" />
        <div className="mt-2 h-3.5 w-2/3 rounded-full bg-lila-100" />

        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-lila-100" />
          <div className="h-6 w-16 rounded-full bg-lila-100" />
        </div>

        <div className="flex-1" />

        <div className="mt-5 h-12 w-full rounded-full bg-lila-100" />
      </div>
    </div>
  )
}
