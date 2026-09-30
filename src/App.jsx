/**
 * App.jsx
 * -----------------------------------------------------------------------------
 * Componente raiz. Solo orquesta: pide los datos al hook y compone las
 * secciones. Toda la logica de negocio vive en hooks, servicios y utilidades.
 * -----------------------------------------------------------------------------
 */

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { useProducts } from './hooks/useProducts'

export default function App() {
  // Unico punto de acceso a los datos del catalogo
  const { products, loading, error, refetch } = useProducts()

  return (
    // El layout usa flex-col + min-h-screen para que el footer quede al pie
    <div className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
      <Navbar />

      <main className="flex-1">
        <Hero />

        <div className="py-12 sm:py-16 lg:py-20">
          <ProductGrid products={products} loading={loading} error={error} onRetry={refetch} />
        </div>
      </main>

      <Footer />

      <BackToTop />
    </div>
  )
}
