/**
 * Catalog.jsx
 * -----------------------------------------------------------------------------
 * Orquestador del catalogo en DOS bloques con intenciones distintas:
 *
 *   1. #disenos   -> portafolio de piezas tejidas a pedido (sin precio ni stock)
 *   2. #materiales -> estambres y trapillo (variantes de color; precio y
 *      disponibilidad solo si la tienda ya los cargo)
 *
 * Los dos bloques comparten el ancho de lectura, pero no el fondo: el
 * portafolio respira sobre el papel y los materiales viven en una banda
 * tintada de lado a lado. Es solo composicion; los datos no cambian.
 *
 * Reparte los datos ya normalizados una sola vez, mantiene el modal de detalle
 * compartido y resuelve los estados de carga/error. Los componentes de cada
 * bloque no conocen el origen de los datos.
 * -----------------------------------------------------------------------------
 */

import { useMemo, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Materials from './Materials'
import Portfolio from './Portfolio'
import ProductDetailModal from './ProductDetailModal'

export default function Catalog({ products = [], loading = false, error = null, onRetry }) {
  const [detail, setDetail] = useState(null)

  // El tono viaja con el producto: abrir la ficha desde un swatch no debe
  // devolver al primer tono de la marca.
  const openDetail = (product, variantId = null) => setDetail({ product, variantId })

  // Separacion por intencion de compra, no por categoria tecnica.
  const designs = useMemo(
    () => products.filter((product) => product.category === 'manualidades'),
    [products]
  )
  const materials = useMemo(
    () => products.filter((product) => product.category !== 'manualidades'),
    [products]
  )

  if (error) {
    return (
      <section
        id="catalogo"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-danger" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">
            No pudimos cargar el catálogo
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink-soft">{error.message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-lila-800"
            >
              <Loader2 className="h-4 w-4" aria-hidden="true" />
              Reintentar
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <div id="catalogo" className="scroll-mt-24">
      {/* Portafolio: fondo de papel */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-16 lg:px-8 lg:pb-8 lg:pt-20">
        <Portfolio
          designs={designs}
          loading={loading}
          onOpenDetail={openDetail}
        />
      </div>

      {/* Materiales: banda tintada a todo el ancho para separar la compra */}
      <div className="border-y border-line bg-sand-50/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <Materials
            materials={materials}
            loading={loading}
            onOpenDetail={openDetail}
          />
        </div>
      </div>

      {/* Modal compartido: adapta su copy segun sea diseno o material. */}
      {detail && (
        <ProductDetailModal
          product={detail.product}
          initialVariantId={detail.variantId}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}
