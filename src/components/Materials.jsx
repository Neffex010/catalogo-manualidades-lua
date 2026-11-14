/**
 * Materials.jsx
 * -----------------------------------------------------------------------------
 * Seccion #materiales: hilos y estambres.
 *
 * Es la parte comprable del catalogo. Reutiliza ProductCard, que resuelve las
 * variantes de color y solo afirma disponibilidad o precio cuando la tienda ya
 * cargo el dato. Al no haber busqueda, orden ni familias de color, la seccion
 * se siente ligera y directa.
 * -----------------------------------------------------------------------------
 */

import { ShoppingBag } from 'lucide-react'
import ColorCatalog from './ColorCatalog'
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
        index="02"
        eyebrow="Materiales"
        title="Hilos y estambres"
        description="Marcas y tonos que manejamos. Pregunta existencias y precio por WhatsApp."
      />

      <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-6">
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
          <div className="col-span-full rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-lila-700" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              Materiales en camino
            </p>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-soft">
              Escríbenos por WhatsApp para consultar existencias y colores disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Carta de color: referencia visual de todas las marcas reales. */}
      <ColorCatalog />
    </section>
  )
}
