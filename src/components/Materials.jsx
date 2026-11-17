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

import { ArrowDown, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react'
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
        description={
          materials.length > 0
            ? `${materials.length} marcas con todos sus tonos. Elige el tuyo.`
            : 'Marcas con todos sus tonos. Elige el tuyo.'
        }
      >
        {/* Atajo para quien viene a buscar un tono concreto: la carta vive
         * despues de las cinco tarjetas y, sin este enlace, obligaba a
         * recorrerlas todas. */}
        <a
          href="#carta-color"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-lila-800 underline decoration-clay/50 decoration-2 underline-offset-4 transition-colors duration-160 hover:text-ink hover:decoration-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-[14px]"
        >
          Ir a la carta de color
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </SectionHeading>

      {lacksPriceAndStock && (
        <p className="mt-3 text-[13px] font-medium text-ink-muted sm:text-[14px]">
          Precios y existencias se confirman por WhatsApp.
        </p>
      )}

      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-9 sm:gap-x-5 sm:gap-y-10 md:grid-cols-2 md:gap-x-4 md:gap-y-4 xl:grid-cols-3 xl:gap-y-5">
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

            {/* Sexta celda: completa la rejilla (2 + 2 + 2 en movil y tablet,
             * 3 + 3 en pantallas anchas) y abre la puerta a las marcas que no
             * tienen carta completa, sin inventar un producto. */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-line bg-sand-50/40 p-4 text-center transition-colors duration-240 ease-artisan hover:border-lila-300 hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:gap-3 sm:p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lila-100 text-lila-800 sm:h-12 sm:w-12">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </span>
              <p className="font-display text-[1.05rem] font-semibold leading-tight text-ink sm:text-[1.3rem]">
                ¿Buscas otra marca?
              </p>
              <p className="max-w-[28ch] text-[12.5px] leading-relaxed text-ink-muted sm:text-[13.5px]">
                También hay otras marcas de hilo y estambre. Pregunta por WhatsApp cuál
                necesitas.
              </p>
              <span className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-lila-800 sm:mt-1 sm:text-[13px]">
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
              Escríbeme por WhatsApp para consultar existencias y tonos disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Carta de color: referencia visual de todas las marcas reales. */}
      <ColorCatalog />
    </section>
  )
}
