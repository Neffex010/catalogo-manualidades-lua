/**
 * CategoryFilter.jsx
 * -----------------------------------------------------------------------------
 * Filtro por categorias. El listado y su ORDEN provienen de `getCategories`,
 * que a su vez respeta el orden oficial de `CATEGORIES` (Amigurumis, Eventos,
 * Flores, Llaveros) y siempre muestra las 4, tengan o no piezas.
 *
 * En moviles es un carrusel horizontal con scroll-snap.
 * -----------------------------------------------------------------------------
 */

import { ALL_CATEGORY, ALL_CATEGORY_LABEL } from '../config/site'

/**
 * @param {object} props
 * @param {Array<{name: string, label: string, count: number}>} props.categories
 * @param {string} props.activeCategory   Categoria seleccionada o 'all'
 * @param {(category: string) => void} props.onChange
 */
export default function CategoryFilter({ categories, activeCategory, onChange }) {
  const total = categories.reduce((acc, category) => acc + category.count, 0)

  // Opcion "Todos" + las categorias oficiales en su orden
  const options = [
    { name: ALL_CATEGORY, label: ALL_CATEGORY_LABEL, count: total },
    ...categories,
  ]

  return (
    <div className="relative w-full">
      <h2 className="sr-only">Filtrar por categoría</h2>

      {/* ----------------------------------------------------------------
       * Carrusel horizontal en movil, fila completa en escritorio. Son
       * botones de filtro (no pestanas), asi que se anuncia el estado con
       * `aria-pressed` en vez del patron tablist/tab, que ademas exigiria
       * navegacion con flechas y un tabpanel que aqui no existe.
       * ---------------------------------------------------------------- */}
      <div
        role="group"
        aria-label="Categorías del catálogo"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {options.map((option) => {
          const isActive = activeCategory === option.name
          const isEmpty = option.count === 0

          return (
            <button
              key={option.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.name)}
              title={isEmpty ? `${option.label}: sin piezas por ahora` : option.label}
              className={[
                'inline-flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ease-artisan focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-sm',
                isActive
                  ? 'border-brand bg-brand text-white shadow-brand hover:bg-lila-800'
                  : 'border-line bg-surface text-ink-soft shadow-soft hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-800',
                // Sin piezas: se atenua para no parecer un enlace roto.
                isEmpty && !isActive ? 'opacity-55' : '',
              ].join(' ')}
            >
              {option.label}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors',
                  isActive ? 'bg-white text-brand' : 'bg-lila-100 text-lila-800',
                ].join(' ')}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Degradado que aparece solo en movil: avisa de que hay mas categorias
       * fuera de pantalla sin quitarle el scroll al usuario. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas to-transparent sm:hidden"
      />
    </div>
  )
}
