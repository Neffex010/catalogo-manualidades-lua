/**
 * SubcategoryFilter.jsx
 * -----------------------------------------------------------------------------
 * Filtro secundario del portafolio (Amigurumis, Flores, Llaveros, Eventos).
 * Segmenta los disenos tejidos a pedido para que el portafolio se recorra por
 * tipo de pieza, sin buscador ni controles extra.
 * -----------------------------------------------------------------------------
 */

/**
 * @param {object} props
 * @param {Array<{ name: string, label: string, count: number }>} props.subcategories
 * @param {string} props.activeSubcategory   Subcategoria seleccionada o 'all'
 * @param {(subcategory: string) => void} props.onChange
 */
export default function SubcategoryFilter({
  subcategories = [],
  activeSubcategory = 'all',
  onChange,
}) {
  if (subcategories.length === 0) return null

  const total = subcategories.reduce((acc, sub) => acc + sub.count, 0)
  const options = [{ name: 'all', label: 'Todos los diseños', count: total }, ...subcategories]

  return (
    <div className="relative w-full">
      <div
        role="group"
        aria-label="Tipos de diseño"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <span className="hidden text-[10px] font-bold uppercase tracking-wide text-ink-muted sm:inline-block sm:mr-1">
          Tipo:
        </span>
        {options.map((option) => {
          const isActive = activeSubcategory === option.name

          return (
            <button
              key={option.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.name)}
              className={[
                'inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ease-artisan focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-lila-800 text-white shadow-soft'
                  : 'bg-sand-100 text-ink-soft hover:bg-sand-200 hover:text-ink',
              ].join(' ')}
            >
              {option.label}
              <span
                className={[
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums',
                  isActive ? 'bg-white/20 text-white' : 'bg-surface text-ink-muted',
                ].join(' ')}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
