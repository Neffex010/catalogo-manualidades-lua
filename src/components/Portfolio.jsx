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

/** Diseños visibles al entrar. Una primera pantalla corta invita a seguir. */
const INITIAL_COUNT = 8

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
        eyebrow="Portafolio"
        title="Diseños tejidos a pedido"
        description="Estas fotos son muestras reales de nuestro trabajo. Elige el diseño que te guste y lo tejemos especialmente para ti: no manejamos inventario de piezas terminadas."
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
              Estamos preparando nuevos diseños
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Escríbenos y con gusto te mostramos trabajos recientes de esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Paginacion por tandas: el portafolio no obliga a recorrer todo. */}
      {!loading && shownDesigns.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
          <p role="status" aria-live="polite" className="text-[13px] text-ink-muted sm:text-[14px]">
            Mostrando{' '}
            <span className="font-semibold tabular-nums text-ink-soft">
              {shownDesigns.length}
            </span>{' '}
            de{' '}
            <span className="font-semibold tabular-nums text-ink-soft">
              {filteredDesigns.length}
            </span>{' '}
            {filteredDesigns.length === 1 ? 'diseño' : 'diseños'}
          </p>

          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-lila-300 bg-surface px-7 py-3.5 text-[15px] font-semibold text-lila-800 shadow-soft transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:translate-y-0"
            >
              <Plus
                className="h-4 w-4 transition-transform duration-240 group-hover:rotate-90"
                aria-hidden="true"
              />
              Ver más diseños
            </button>
          )}
        </div>
      )}

      {/* Cierre del portafolio: refuerza el trabajo personalizado. */}
      <div className="mt-10 flex flex-col items-start gap-5 border-l-[3px] border-clay bg-clay-soft/45 px-5 py-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
        <div>
          <p className="font-display text-[1.35rem] font-semibold text-ink sm:text-[1.5rem]">
            ¿Tienes otra idea en mente?
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
            También tejemos diseños personalizados: cuéntanos qué imaginas y lo hacemos realidad.
          </p>
        </div>
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lila-800 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-soft"
        >
          Platícame tu idea
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
