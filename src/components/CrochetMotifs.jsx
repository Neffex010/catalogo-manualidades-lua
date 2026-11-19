/**
 * CrochetMotifs.jsx
 * -----------------------------------------------------------------------------
 * Motivos decorativos de crochet: madeja y ganchillo.
 *
 * Son SVG de trazo, con el mismo lenguaje visual que los iconos de lucide
 * (linea de 1.6-1.7 px, extremos redondeados). Se pintan con `currentColor`,
 * asi que heredan el tono del texto que acompanan.
 *
 * Siempre son decorativos: llevan `aria-hidden` y no reciben foco. El nombre
 * del material o de la accion lo sigue diciendo el texto, nunca el dibujo.
 * -----------------------------------------------------------------------------
 */

import { useId } from 'react'

/** Props comunes a los dos motivos. */
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

/**
 * Madeja de hilo: circulo con hebras cruzadas recortadas por el propio borde.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.strokeWidth]
 */
export function YarnBallIcon({ className, strokeWidth = 1.6, ...props }) {
  // El id del clip debe ser unico por instancia y sin `:` para que `url(#id)`
  // funcione en todos los navegadores.
  const clipId = `yarn-${useId().replace(/:/g, '')}`

  return (
    <svg
      {...svgProps}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="8.7" />
        </clipPath>
      </defs>

      <circle cx="12" cy="12" r="9" />
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(34 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(-34 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.3" transform="rotate(90 12 12)" />
      </g>
    </svg>
  )
}

/**
 * Ganchillo: mango diagonal y gancho curvado en la punta.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.strokeWidth]
 */
export function CrochetHookIcon({ className, strokeWidth = 1.7, ...props }) {
  return (
    <svg
      {...svgProps}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    >
      {/* Mango */}
      <path d="M4 20 17 7" />
      {/* Gancho: media luna con la punta hacia abajo */}
      <path d="M17 7a3 3 0 1 0-6 0v1.5" />
    </svg>
  )
}
