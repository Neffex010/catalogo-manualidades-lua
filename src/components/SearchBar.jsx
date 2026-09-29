/**
 * SearchBar.jsx
 * -----------------------------------------------------------------------------
 * Campo de busqueda por nombre, descripcion, categoria o etiqueta.
 * Es controlado por el componente padre (ProductGrid).
 * -----------------------------------------------------------------------------
 */

import { Search, X } from 'lucide-react'

/**
 * @param {object} props
 * @param {string} props.value            Texto actual de la busqueda
 * @param {(value: string) => void} props.onChange
 * @param {number} props.resultCount       Resultados visibles
 * @param {number} props.totalCount        Total de productos
 */
export default function SearchBar({ value, onChange, resultCount, totalCount }) {
  const hasValue = value.trim().length > 0

  return (
    <div className="w-full">
      <label htmlFor="catalogo-busqueda" className="sr-only">
        Buscar en el catálogo
      </label>

      <div className="relative">
        {/* Icono de lupa */}
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-lila-500"
          aria-hidden="true"
        />

        <input
          id="catalogo-busqueda"
          type="search"
          inputMode="search"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por nombre, categoría o etiqueta..."
          aria-describedby="catalogo-busqueda-ayuda"
          className="w-full rounded-full border border-line bg-surface py-3.5 pl-11 pr-24 text-sm text-ink shadow-soft outline-none transition-all duration-300 ease-artisan placeholder:text-ink-muted hover:border-lila-400 focus:border-lila-600 focus:ring-4 focus:ring-lila-200/70 sm:py-4 sm:text-base [&::-webkit-search-cancel-button]:hidden"
        />

        {/* Boton para limpiar la busqueda */}
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Limpiar busqueda"
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-lila-100 text-lila-700 transition-all duration-200 hover:bg-lila-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {!hasValue && (
          <span className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 text-xs font-medium text-ink-muted sm:block">
            {totalCount} piezas
          </span>
        )}
      </div>

      {/* Contador de resultados: solo ocupa espacio cuando hay busqueda,
       * el resto del tiempo queda disponible para lectores de pantalla. */}
      <p
        id="catalogo-busqueda-ayuda"
        aria-live="polite"
        className={
          hasValue
            ? 'mt-1.5 px-1 text-[11px] text-ink-muted sm:mt-2 sm:text-sm'
            : 'sr-only'
        }
      >
        {hasValue
          ? `${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para "${value.trim()}"`
          : `Campo de búsqueda. ${totalCount} piezas disponibles para filtrar por nombre, categoría o etiqueta.`}
      </p>
    </div>
  )
}
