/**
 * useProducts.js
 * -----------------------------------------------------------------------------
 * Hook que encapsula el ciclo de vida de los datos del catalogo
 * (carga / error / refetch) consumiendo productService.
 *
 * Gracias a esta capa, ningun componente necesita saber de donde vienen los
 * datos: hoy es un JSON local, manana sera FastAPI sin cambiar una linea de JSX.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { sortProducts } from '../utils/catalog'

/**
 * @returns {{
 *   products: Array<object>,
 *   loading: boolean,
 *   error: Error|null,
 *   refetch: () => Promise<void>
 * }}
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(sortProducts(data))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar el catálogo'))
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      await loadProducts()
      if (cancelled) return
    })()

    return () => {
      cancelled = true
    }
  }, [loadProducts])

  return { products, loading, error, refetch: loadProducts }
}
