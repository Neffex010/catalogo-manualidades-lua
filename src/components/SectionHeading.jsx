/**
 * SectionHeading.jsx
 * -----------------------------------------------------------------------------
 * Encabezado comun de las dos secciones del catalogo (Disenos y Materiales).
 *
 * Mantiene el mismo ritmo tipografico en ambas: antetitulo, titulo, descripcion
 * y, opcionalmente, una accion a la derecha. Al compartirlo, las secciones no
 * repiten clases ni se desalinean entre si.
 * -----------------------------------------------------------------------------
 */

/**
 * @param {object} props
 * @param {string} [props.id]          Id del titulo (para aria-labelledby)
 * @param {string} props.eyebrow       Antetitulo corto
 * @param {string} props.title         Titulo de la seccion
 * @param {string} [props.description] Texto de apoyo
 * @param {React.ReactNode} [props.children] Accion opcional alineada a la derecha
 */
export default function SectionHeading({ id, eyebrow, title, description, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lila-800">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
            {description}
          </p>
        )}
      </div>

      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
