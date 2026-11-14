/**
 * SectionHeading.jsx
 * -----------------------------------------------------------------------------
 * Encabezado comun de las dos secciones del catalogo (Disenos y Materiales).
 *
 * Tiene tratamiento de masthead editorial: un filo superior recorre toda la
 * seccion, un indice numerico marca el orden de lectura y el titulo sube de
 * escala para que cada bloque se reconozca de un vistazo. La estructura de
 * datos (antetitulo, titulo, descripcion y accion) no cambia.
 * -----------------------------------------------------------------------------
 */

/**
 * @param {object} props
 * @param {string} [props.id]          Id del titulo (para aria-labelledby)
 * @param {string} [props.index]       Indice decorativo de la seccion ("01")
 * @param {string} props.eyebrow       Antetitulo corto
 * @param {string} props.title         Titulo de la seccion
 * @param {string} [props.description] Texto de apoyo
 * @param {React.ReactNode} [props.children] Accion opcional alineada a la derecha
 */
export default function SectionHeading({ id, index, eyebrow, title, description, children }) {
  return (
    <div className="border-t-2 border-ink/15 pt-5 sm:pt-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="flex gap-4 sm:gap-6">
          {index && (
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 font-mono text-[13px] font-semibold tracking-[0.18em] text-clay"
            >
              {index}
            </span>
          )}

          <div className="max-w-2xl">
            <p className="eyebrow">{eyebrow}</p>

            <h2
              id={id}
              className="mt-3 font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-[3.4rem] lg:text-[3.8rem]"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-ink-soft sm:text-[17px]">
                {description}
              </p>
            )}
          </div>
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  )
}
