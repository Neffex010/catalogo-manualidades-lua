/**
 * App.jsx
 * -----------------------------------------------------------------------------
 * Componente raiz. Solo orquesta: pide los datos al hook y compone las
 * secciones. Toda la logica de negocio vive en hooks, servicios y utilidades.
 * -----------------------------------------------------------------------------
 */

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import StoreInfo from './components/StoreInfo'
import Footer from './components/Footer'
import { useProducts } from './hooks/useProducts'

export default function App() {
  // Unico punto de acceso a los datos del catalogo
  const { products, loading, error, refetch } = useProducts()

  return (
    // El layout usa flex-col + min-h-screen para que el footer quede al pie
    <div className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      <Navbar />

      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        <Hero />

        {/* El catalogo maneja su propio ritmo: portafolio sobre papel y
            materiales sobre una banda tintada de lado a lado. */}
        <Catalog products={products} loading={loading} error={error} onRetry={refetch} />

        <StoreInfo />
      </main>

      <Footer />
    </div>
  )
}
