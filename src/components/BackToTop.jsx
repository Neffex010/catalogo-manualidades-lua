/**
 * BackToTop.jsx
 * -----------------------------------------------------------------------------
 * Boton flotante que devuelve al inicio de la pagina. Con 105 piezas el
 * scroll es largo y no siempre se ve la cabecera, asi que el boton aparece
 * cuando ya se ha bajado lo suficiente.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Pixels que hay que bajar antes de mostrar el boton. */
const SHOW_AFTER = 600

/** Se indica la posicion vertical a la vez para evitar relayouts al leerla. */
let lastScrollY = 0

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    lastScrollY = window.scrollY

    // `passive` para que el navegador no espere al manejador, y un solo
    // listener: hacer scroll no debe costar trabajo de JavaScript.
    const handleScroll = () => {
      const current = window.scrollY
      // Un salto hacia arriba (un < 1px de diferencia) no dispara el estado.
      if (Math.abs(current - lastScrollY) < 1) return
      lastScrollY = current
      setIsVisible(current > SHOW_AFTER)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goToTop = useCallback(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }, [])

  // Fuera de la vista no se renderiza: asi no queda en el tab order.
  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={goToTop}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
      className="animate-fade-in-up fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/90 text-lila-800 shadow-lift backdrop-blur-md transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:bottom-7 sm:right-7 sm:h-12 sm:w-12"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
