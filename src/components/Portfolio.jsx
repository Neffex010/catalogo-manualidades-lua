/**
 * Portfolio.jsx
 * -----------------------------------------------------------------------------
 * Seccion #disenos: portafolio de piezas tejidas POR ENCARGO.
 *
 * A diferencia de los materiales, aqui no hay inventario: cada foto muestra el
 * acabado de un trabajo real y sirve como referencia para pedir uno parecido.
 * Por eso no se muestran precios, stock ni filtros de busqueda/orden. Solo se
 * segmenta por tipo de pieza para que el portafolio sea facil de recorrer.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Plus, Sparkles } from 'lucide-react'
import DesignCard from './DesignCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import SectionHeading from './SectionHeading'
import SubcategoryFilter from './SubcategoryFilter'
import { getSubcategories } from '../utils/catalog'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

/** Diseños visibles al entrar. Dos tandas cortas invitan a seguir. */
const INITIAL_COUNT = 6

/** Cuantos diseños se suman con "Ver más diseños". */
const PAGE_SIZE = 8

export default function Portfolio({ designs = [], loading = false, onOpenDetail }) {
  const [activeSubcategory, setActiveSubcategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const subcategories = useMemo(() => getSubcategories(designs), [designs])

  const filteredDesigns = useMemo(
    () =>
      activeSubcategory === 'all'
        ? designs
        : designs.filter((design) => design.subcategory === activeSubcategory),
    [designs, activeSubcategory]
  )

  const shownDesigns = filteredDesigns.slice(0, visibleCount)
  const hasMore = shownDesigns.length < filteredDesigns.length

  // Un catalogo nuevo (p. ej. tras un refetch) reinicia la tanda.
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT)
  }, [designs])

  const handleSubcategoryChange = (subcategory) => {
    setActiveSubcategory(subcategory)
    setVisibleCount(INITIAL_COUNT)
  }

  return (
    <section id="disenos" aria-labelledby="disenos-titulo">
      <SectionHeading
        id="disenos-titulo"
        index="01"
        title="Diseños que ya tejí"
        description="Fotos de piezas reales. Elige la que te guste y la hago a tu medida."
      />

      {/* Segmento por tipo de pieza. Los conteos salen del catalogo real. */}
      <div className="mt-7 sm:mt-9">
        <SubcategoryFilter
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onChange={handleSubcategoryChange}
        />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-9 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
        {loading ? (
          Array.from({ length: INITIAL_COUNT }, (_, index) => (
            <ProductCardSkeleton key={`design-skeleton-${index}`} variant="design" />
          ))
        ) : shownDesigns.length > 0 ? (
          shownDesigns.map((design, index) => (
            <DesignCard
              key={design.id}
              design={design}
              index={index}
              onOpenDetail={onOpenDetail}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-lila-700" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              Estoy preparando nuevos diseños
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Escríbeme y te muestro trabajos recientes de esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Paginacion por tandas: el portafolio no obliga a recorrer todo. El
       * conteo viaja dentro del boton para no gastar una linea aparte. */}
      {!loading && shownDesigns.length > 0 && (
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-lila-300 bg-surface px-6 py-3.5 text-[14px] font-semibold text-lila-800 shadow-soft transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:translate-y-0 sm:px-7 sm:text-[15px]"
            >
              <Plus
                className="h-4 w-4 transition-transform duration-240 group-hover:rotate-90"
                aria-hidden="true"
              />
              Ver{' '}
              <span className="tabular-nums">
                {Math.min(PAGE_SIZE, filteredDesigns.length - shownDesigns.length)}
              </span>{' '}
              más
              <span className="ml-1 font-normal text-ink-muted group-hover:text-white/80">
                · {filteredDesigns.length}{' '}
                {filteredDesigns.length === 1 ? 'diseño' : 'diseños'}
              </span>
            </button>
          ) : (
            <p className="text-[13px] text-ink-muted sm:text-[14px]">
              {filteredDesigns.length === 1
                ? '1 diseño'
                : `${filteredDesigns.length} diseños`}
            </p>
          )}

          {/* Anuncio para lectores de pantalla al cargar una tanda nueva. */}
          <p role="status" aria-live="polite" className="sr-only">
            Mostrando {shownDesigns.length} de {filteredDesigns.length}{' '}
            {filteredDesigns.length === 1 ? 'diseño' : 'diseños'}
          </p>
        </div>
      )}

      {/* Cierre del portafolio: una linea, no un segundo banner. El bloque
       * grande de WhatsApp vive al pie de la pagina; repetirlo aqui alargaba
       * el scroll con el mismo mensaje. */}
      <p className="mt-8 text-center text-[14px] text-ink-soft sm:mt-10 sm:text-[15px]">
        ¿No está lo que buscas?{' '}
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-lila-800 underline decoration-clay/50 decoration-2 underline-offset-4 transition-colors duration-160 hover:text-ink hover:decoration-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          Tejo tu diseño a medida
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </section>
  )
}
