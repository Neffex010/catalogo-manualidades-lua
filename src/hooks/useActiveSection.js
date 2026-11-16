/**
 * useActiveSection.js
 * -----------------------------------------------------------------------------
 * Devuelve el id de la seccion que el usuario esta leyendo para marcar la
 * navegacion superior.
 *
 * En una pagina larga, una cabecera fija sin estado obliga al visitante a
 * recordar donde esta. IntersectionObserver avisa cuando una seccion cruza la
 * banda central de la pantalla; no se escucha `scroll`, asi que recorrer el
 * catalogo no cuesta trabajo de JavaScript.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

/** Punto de la pantalla (35%) que decide que seccion esta activa. */
const REFERENCE_RATIO = 0.35

/**
 * @param {ReadonlyArray<string>} ids Ids de las secciones, en orden de lectura
 * @returns {string|null} Id de la seccion visible
 */
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  // Una clave estable evita reiniciar el observer si el array se recrea.
  const key = ids.join('|')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const nodes = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (nodes.length === 0) return

    const pickActive = () => {
      const line = window.innerHeight * REFERENCE_RATIO
      let closestId = nodes[0].id
      let closestDistance = Number.POSITIVE_INFINITY

      for (const node of nodes) {
        const { top, bottom } = node.getBoundingClientRect()

        // La seccion que contiene la linea de referencia gana de inmediato.
        if (top <= line && bottom > line) {
          setActiveId(node.id)
          return
        }

        // En los bordes (hero, ultimo bloque) se elige la mas cercana.
        const distance = Math.min(Math.abs(top - line), Math.abs(bottom - line))
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = node.id
        }
      }

      setActiveId(closestId)
    }

    const observer = new IntersectionObserver(pickActive, {
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.5, 1],
    })

    nodes.forEach((node) => observer.observe(node))
    pickActive()

    return () => observer.disconnect()
  }, [key])

  return activeId
}

export default useActiveSection
