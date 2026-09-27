/**
 * EmptyState.jsx
 * -----------------------------------------------------------------------------
 * Estado vacio: se muestra cuando la busqueda o el filtro no dejan resultados,
 * o cuando el catalogo esta vacio. Incluye una accion para limpiar filtros.
 * -----------------------------------------------------------------------------
 */

import { SearchX, RotateCcw, MessageCircle } from 'lucide-react'
import { ALL_CATEGORY } from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.searchTerm
 * @param {string} props.category
 * @param {() => void} props.onReset
 */
export default function EmptyState({ title, description, searchTerm, category, onReset }) {
  const hasFilters = Boolean(searchTerm || (category && category !== ALL_CATEGORY))

  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/70 px-6 py-14 text-center sm:py-20">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-lila-100 text-lila-600">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>

      <h3 className="mt-5 font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
        {description}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-soft transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-lila-400 hover:bg-lila-50 hover:text-lila-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpiar filtros
          </button>
        )}

        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:bg-lila-700 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          ¿Lo hacemos a medida? Escríbenos
        </a>
      </div>
    </div>
  )
}
