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

import { useMemo, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import EmptyState from './EmptyState'
import { ALL_CATEGORY } from '../config/site'
import { filterProducts, getCategories } from '../utils/catalog'

/** Cuantas tarjetas se muestran mientras cargan los datos. */
const SKELETON_COUNT = 6

export default function ProductGrid({ products = [], loading = false, error = null, onRetry }) {
  // --- Estado local de la vista -------------------------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)

  // --- Datos derivados (memorizados para no recalcular en cada render) ----
  // Las categorias se derivan del catalogo respetando el orden oficial.
  const categories = useMemo(() => getCategories(products), [products])

  const visibleProducts = useMemo(
    () => filterProducts(products, { search: searchTerm, category: activeCategory }),
    [products, searchTerm, activeCategory]
  )

  // Vuelve a "Todos" cuando el catalogo cambia (p. ej. tras un refetch)
  const resetFilters = () => {
    setSearchTerm('')
    setActiveCategory(ALL_CATEGORY)
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
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-lila-700"
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lila-600">
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
       * ---------------------------------------------------------------- */}
      <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-start sm:gap-6">
        <div className="sm:w-full sm:max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            resultCount={visibleProducts.length}
            totalCount={products.length}
          />
        </div>
        <div className="sm:flex-1">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------
       * Rejilla de productos
       * ---------------------------------------------------------------- */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-7">
        {loading ? (
          // Esqueletos mientras el servicio resuelve
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : visibleProducts.length > 0 ? (
          visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
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
    </section>
  )
}
