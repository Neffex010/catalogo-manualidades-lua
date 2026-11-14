/**
 * SubcategoryFilter.jsx
 * -----------------------------------------------------------------------------
 * Filtro secundario del portafolio (Amigurumis, Flores, Llaveros, Eventos).
 * Segmenta los disenos tejidos a pedido para que el portafolio se recorra por
 * tipo de pieza, sin buscador ni controles extra.
 *
 * Visual: pestanas editoriales sobre un filo. La activa se marca con un
 * subrayado de tinta en lugar de una pildora rellena, y los conteos van en
 * monoespaciada para leerse como indice.
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
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-stretch gap-0 overflow-x-auto border-b-2 border-ink/10 px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <span className="meta-label mr-4 hidden shrink-0 self-center sm:inline-block">
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
                '-mb-[2px] inline-flex shrink-0 snap-start items-center gap-1.5 border-b-[3px] px-3 py-3 text-[14px] font-semibold transition-colors duration-160 ease-artisan focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:px-4 sm:text-[15px]',
                isActive
                  ? 'border-clay text-ink'
                  : 'border-transparent text-ink-muted hover:border-line hover:text-ink',
              ].join(' ')}
            >
              {option.label}
              <span
                className={[
                  'font-mono text-[11px] font-bold tabular-nums sm:text-[12px]',
                  isActive ? 'text-clay-deep' : 'text-ink-muted/70',
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
