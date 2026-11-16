/**
 * Materials.jsx
 * -----------------------------------------------------------------------------
 * Seccion #materiales: estambres y trapillo.
 *
 * Es la parte comprable del catalogo. Reutiliza ProductCard, que resuelve las
 * variantes de color y solo afirma disponibilidad o precio cuando la tienda ya
 * cargo el dato. Al no haber busqueda, orden ni familias de color, la seccion
 * se siente ligera y directa.
 * -----------------------------------------------------------------------------
 */

import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react'
import ColorCatalog from './ColorCatalog'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import SectionHeading from './SectionHeading'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

/** Esqueletos visibles mientras llega el catalogo (5 marcas reales). */
const SKELETON_COUNT = 5

export default function Materials({ materials = [], loading = false, onOpenDetail }) {
  // Si ninguna marca publica precio ni stock, la condicion se explica una sola
  // vez aqui en lugar de repetirla en las cinco tarjetas.
  const lacksPriceAndStock =
    materials.length > 0 &&
    materials.every(
      (product) =>
        product.price == null &&
        !(product.variants ?? []).some((variant) => typeof variant.stock === 'number')
    )

  return (
    <section id="materiales" aria-labelledby="materiales-titulo">
      <SectionHeading
        id="materiales-titulo"
        index="02"
        eyebrow="Materiales"
        title="Estambres y trapillo"
        description="Cinco marcas con todos sus tonos. Elige el tono, la cantidad y envía tu pedido."
      />

      {lacksPriceAndStock && (
        <p className="mt-3 text-[13px] font-medium text-ink-muted sm:text-[14px]">
          Precios y existencias se confirman por WhatsApp.
        </p>
      )}

      <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-6">
        {loading ? (
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={`material-skeleton-${index}`} />
          ))
        ) : materials.length > 0 ? (
          <>
            {materials.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onOpenDetail={onOpenDetail}
              />
            ))}

            {/* Sexta celda en xl: completa el grid 3+2 y abre la puerta a las
             * marcas que no tienen carta completa, sin inventar un producto. */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-sand-50/40 p-6 text-center transition-colors duration-240 ease-artisan hover:border-lila-300 hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas xl:flex"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-lila-100 text-lila-800">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-display text-[1.3rem] font-semibold leading-tight text-ink">
                ¿Buscas otra marca?
              </p>
              <p className="max-w-[28ch] text-[13.5px] leading-relaxed text-ink-muted">
                También manejamos otras marcas de hilo y estambre. Pregúntanos cuál
                necesitas.
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-lila-800">
                Preguntar por WhatsApp
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          </>
        ) : (
          <div className="col-span-full rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-lila-700" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              Materiales en camino
            </p>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-soft">
              Escríbenos por WhatsApp para consultar existencias y tonos disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Carta de color: referencia visual de todas las marcas reales. */}
      <ColorCatalog />
    </section>
  )
}
