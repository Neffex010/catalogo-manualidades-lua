/**
 * Materials.jsx
 * -----------------------------------------------------------------------------
 * Seccion #materiales: hilos y estambres disponibles.
 *
 * Es la parte comprable del catalogo. Reutiliza ProductCard, que ya resuelve
 * variantes de color, stock y precio (solo los hilos lo publican). Al no haber
 * busqueda, orden ni familias de color, la seccion se siente ligera y directa.
 * -----------------------------------------------------------------------------
 */

import { ShoppingBag } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import SectionHeading from './SectionHeading'

/** Esqueletos visibles mientras llega el catalogo (4 productos reales). */
const SKELETON_COUNT = 4

export default function Materials({ materials = [], loading = false, onOpenDetail }) {
  return (
    <section id="materiales" aria-labelledby="materiales-titulo">
      <SectionHeading
        id="materiales-titulo"
        eyebrow="Materiales"
        title="Hilos y estambres disponibles"
        description="Elige el color exacto para tu proyecto. Los hilos tienen precio fijo; los estambres se cotizan según la marca y el color que elijas."
      />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-6">
        {loading ? (
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={`material-skeleton-${index}`} />
          ))
        ) : materials.length > 0 ? (
          materials.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onOpenDetail={onOpenDetail}
            />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-line bg-surface px-6 py-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-lila-700" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              Materiales en camino
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Escríbenos por WhatsApp para consultar existencias y colores disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
