/**
 * useRevealOnScroll.js
 * -----------------------------------------------------------------------------
 * Detecta cuando un elemento entra en pantalla para animar su aparicion.
 *
 * Devuelve una ref (que hay que colgar del elemento) y un booleano. La clase CSS
 * se decide en el componente, normalmente con `.reveal` y `.is-visible`.
 *
 * Se usa IntersectionObserver en lugar de escuchar el evento `scroll`: es mucho
 * mas barato (el navegador avisa solo cuando hace falta) y no bloquea el hilo
 * principal mientras el usuario recorre el catalogo.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react'

/**
 * El observer suelta el elemento en cuanto se revela: no hace falta volver a
 * animarlo si el usuario sube y baja. El margen inferior negativo retrasa un
 * poco el disparo para que la tarjeta no aparezca ya a medio camino.
 */
const OBSERVER_OPTIONS = { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }

export function useRevealOnScroll() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Sin soporte de IntersectionObserver, o si el usuario pidio menos
    // movimiento, se muestra todo de inmediato: nunca dejamos nada oculto.
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      setIsVisible(true)
      observer.disconnect()
    }, OBSERVER_OPTIONS)

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}
