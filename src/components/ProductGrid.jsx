/**
 * ProductGrid.jsx
 * -----------------------------------------------------------------------------
 * CONTENEDOR PRINCIPAL DEL CATALOGO.
 *
 * Concentra todo el estado de la vista (busqueda + categoria seleccionada) y
 * renderiza: barra de busqueda, filtro de categorias y la rejilla de tarjetas.
 * No conoce el origen de los datos; solo recibe el catalogo ya normalizado.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Loader2, Plus } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import EmptyState from './EmptyState'
import { ALL_CATEGORY } from '../config/site'
import { filterProducts, getCategories } from '../utils/catalog'

/**
 * Cuantas tarjetas se muestran mientras cargan los datos. Son multiplos de 4
 * para que el grid de escritorio se vea siempre con filas completas.
 */
const SKELETON_COUNT = 8

/** Cuantas tarjetas se pintan por tanda (se amplian con "Cargar mas"). */
const PAGE_SIZE = 12

/** Alto real de la cabecera fija, para pegar los controles debajo. */
const NAVBAR_OFFSET = 'top-[69px] sm:top-[81px]'

export default function ProductGrid({ products = [], loading = false, error = null, onRetry }) {
  // --- Estado local de la vista -------------------------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)

  // Cuantas tarjetas se han revelado; el resto se carga bajo demanda.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // --- Datos derivados (memorizados para no recalcular en cada render) ----
  // Las categorias se derivan del catalogo respetando el orden oficial.
  const categories = useMemo(() => getCategories(products), [products])

  // Todos los productos que pasan los filtros...
  const visibleProducts = useMemo(
    () => filterProducts(products, { search: searchTerm, category: activeCategory }),
    [products, searchTerm, activeCategory]
  )

  // ...de los cuales solo se pintan los primeros `visibleCount`.
  const shownProducts = useMemo(
    () => visibleProducts.slice(0, visibleCount),
    [visibleProducts, visibleCount]
  )

  const hasMore = shownProducts.length < visibleProducts.length

  // Un catalogo nuevo (p. ej. tras un refetch) reinicia las tandas.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [products])

  // Cualquier cambio de filtro vuelve a la primera tanda para no dejar
  // al usuario con la vista a medias de un listado que ya no existe.
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setVisibleCount(PAGE_SIZE)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setVisibleCount(PAGE_SIZE)
  }

  const loadMore = () => setVisibleCount((count) => count + PAGE_SIZE)

  // Vuelve a "Todos" cuando el catalogo cambia (p. ej. tras un refetch)
  const resetFilters = () => {
    setSearchTerm('')
    setActiveCategory(ALL_CATEGORY)
    setVisibleCount(PAGE_SIZE)
  }

  // --- Estado de error ---------------------------------------------------
  if (error) {
    return (
      <section id="catalogo" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-danger/30 bg-danger-soft/40 px-6 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-danger" aria-hidden="true" />
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">
            No pudimos cargar el catálogo
          </h3>
          <p className="mt-2 max-w-md text-sm text-ink-soft">{error.message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-lila-800"
            >
              <Loader2 className="h-4 w-4" aria-hidden="true" />
              Reintentar
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      id="catalogo"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
      aria-label="Catálogo de productos"
    >
      {/* ------------------------------------------------------------------
       * Encabezado de la seccion
       * ---------------------------------------------------------------- */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lila-800">
          Nuestro catálogo
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Amigurumis, eventos, flores y llaveros
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Cada pieza se teje punto por punto. Elige la que más te guste, escríbenos por WhatsApp y
          te cotizamos sin compromiso.
        </p>
      </div>

      {/* ------------------------------------------------------------------
       * Controles: busqueda + categorias
       *
       * Fila PEGAJOSA: al haber muchas piezas, el buscador y los filtros
       * deben seguir al alcance sin volver arriba. El fondo translucido con
       * desenfoque deja ver el contenido que pasa por debajo.
       * ---------------------------------------------------------------- */}
      <div
        className={[
          'sticky z-30 -mx-4 mt-8 border-b border-line/70 bg-canvas/85 px-4 py-3 backdrop-blur-md',
          'sm:mx-0 sm:mt-10 sm:px-0 sm:pb-4 sm:pt-3 lg:py-4',
          NAVBAR_OFFSET,
        ].join(' ')}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="sm:w-full sm:max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              resultCount={visibleProducts.length}
              totalCount={products.length}
            />
          </div>
          <div className="sm:flex-1">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
       * Rejilla de productos
       * ---------------------------------------------------------------- */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7">
        {loading ? (
          // Esqueletos mientras el servicio resuelve
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : visibleProducts.length > 0 ? (
          shownProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        ) : (
          // Sin resultados
          <EmptyState
            title={
              searchTerm
                ? `Sin resultados para "${searchTerm.trim()}"`
                : 'No hay piezas en esta categoría'
            }
            description={
              searchTerm
                ? 'Prueba con otra palabra, revisa las etiquetas o escríbenos: seguro podemos tejer algo parecido a tu medida.'
                : 'Esta categoría está temporal sin piezas disponibles. Te avisamos por redes cuando lleguen nuevas creaciones.'
            }
            searchTerm={searchTerm}
            category={activeCategory}
            onReset={resetFilters}
          />
        )}
      </div>

      {/* ------------------------------------------------------------------
       * Paginacion por tandas
       * Evita que el usuario tenga que recorrer 100+ tarjetas de una sola vez.
       * ---------------------------------------------------------------- */}
      {!loading && shownProducts.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
          <p
            role="status"
            aria-live="polite"
            className="text-xs text-ink-muted sm:text-sm"
          >
            Mostrando{' '}
            <span className="font-semibold tabular-nums text-ink-soft">{shownProducts.length}</span>{' '}
            de{' '}
            <span className="font-semibold tabular-nums text-ink-soft">{visibleProducts.length}</span>{' '}
            {visibleProducts.length === 1 ? 'pieza' : 'piezas'}
          </p>

          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              className="group inline-flex items-center gap-2 rounded-full border border-lila-300 bg-surface px-7 py-3.5 text-sm font-semibold text-lila-800 shadow-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:translate-y-0"
            >
              <Plus
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                aria-hidden="true"
              />
              Cargar {Math.min(PAGE_SIZE, visibleProducts.length - shownProducts.length)} más
            </button>
          )}
        </div>
      )}
    </section>
  )
}
