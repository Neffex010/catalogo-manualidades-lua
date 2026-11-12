/**
 * ProductDetailModal.jsx
 * -----------------------------------------------------------------------------
 * Modal de Vista Rapida / Detalle de Producto.
 *
 * Permite apreciar la pieza en gran formato antes de cotizar:
 * - Foto en alta resolucion
 * - Calidad y elaboracion del tejido
 * - Selector de color interactivo (solo estambres e hilos)
 * - Boton para pedir directamente a WhatsApp
 * - Boton para compartir con familiares/amigos (Web Share API / Portapapeles)
 *
 * El copy cambia segun el tipo de pieza: los disenos de `manualidades` son un
 * PORTAFOLIO hecho a pedido (sin precio ni stock); los materiales conservan su
 * disponibilidad y variantes.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Clock,
  Info,
  MessageCircle,
  PackageCheck,
  Share2,
  Sparkles,
  X,
} from 'lucide-react'
import ColorSwatchPicker from './ColorSwatchPicker'
import { formatPrice } from '../utils/format'
import { getDesignWhatsAppUrl, getProductWhatsAppUrl } from '../utils/whatsapp'
import { CATEGORY_LABELS, FALLBACK_IMAGE, PRICED_CATEGORIES, VARIANT_CATEGORIES } from '../config/site'

export default function ProductDetailModal({ product, onClose }) {
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [copied, setCopied] = useState(false)

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants]
  )
  const supportsVariants = variants.length > 0 && VARIANT_CATEGORIES.has(product?.category)

  // Inicializa la variante seleccionada con la primera disponible
  useEffect(() => {
    if (supportsVariants) {
      const firstAvailable = variants.find((v) => v.stock > 0) ?? variants[0]
      setSelectedVariantId(firstAvailable?.id ?? null)
    }
  }, [product, supportsVariants, variants])

  // Cierra con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    // Bloquear scroll de fondo mientras el modal este abierto
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const activeVariant = supportsVariants
    ? variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null
    : null

  const displayImage = activeVariant ?? product
  const imageUrl = displayImage.imageUrl || FALLBACK_IMAGE
  const isDesign = product.category === 'manualidades'
  const isAvailable = activeVariant ? activeVariant.stock > 0 : Boolean(product.available)
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category
  const showsPrice = PRICED_CATEGORIES.includes(product.category)
  const whatsappUrl = isDesign
    ? getDesignWhatsAppUrl(product)
    : getProductWhatsAppUrl(product, activeVariant)

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Manualidades Lua`,
      text: `Mira esta hermosa creación en Manualidades Lua: ${product.name}`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error sharing:', err)
      }
    } else {
      // Fallback a portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      } catch (err) {
        console.error('Error copying link:', err)
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-producto-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Telon de fondo desenfocado */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Contenedor del modal */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl transition-all sm:rounded-4xl animate-in fade-in zoom-in-95 duration-200">
        {/* Boton cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de producto"
          className="absolute right-3.5 top-3.5 z-20 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow-soft backdrop-blur-md transition-all hover:bg-sand-100 hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid flex-1 overflow-y-auto md:grid-cols-2">
          {/* Columna Izquierda: Imagen grande */}
          <div className="relative aspect-4/5 w-full bg-sand-100 md:aspect-auto md:h-full">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {/* Badge: los disenos se tejen a pedido, no tienen stock */}
            <span
              className={[
                'absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-soft backdrop-blur-sm',
                isDesign
                  ? 'bg-lila-100/95 text-lila-800'
                  : isAvailable
                    ? 'bg-success-soft/95 text-success'
                    : 'bg-danger-soft/95 text-danger',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className={[
                  'h-1.5 w-1.5 rounded-full',
                  isDesign
                    ? 'bg-lila-700'
                    : isAvailable
                      ? 'bg-success'
                      : 'bg-danger',
                ].join(' ')}
              />
              {isDesign ? 'Hecho por encargo' : isAvailable ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          {/* Columna Derecha: Informacion y Acciones */}
          <div className="flex flex-col p-6 sm:p-8">
            {/* Categorias */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lila-800">
                {categoryLabel}
              </span>
              {product.subcategory && (
                <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink-muted">
                  {product.subcategory}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink-muted">
                  {product.brand}
                </span>
              )}
            </div>

            <h2
              id="modal-producto-titulo"
              className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              {product.name}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              {product.description}
            </p>

            {/* Selector de variantes (si aplica) */}
            {supportsVariants && (
              <div className="mt-5 rounded-2xl border border-line bg-sand-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Color seleccionado
                  </p>
                  <p className="text-sm font-semibold text-ink-soft">
                    {activeVariant
                      ? `${activeVariant.colorCode} · ${activeVariant.colorName}`
                      : 'Elige un color'}
                  </p>
                </div>

                <div className="mt-3">
                  <ColorSwatchPicker
                    variants={variants}
                    activeVariantId={selectedVariantId}
                    onChange={setSelectedVariantId}
                    maxVisible={12}
                  />
                </div>

                <p
                  className={[
                    'mt-3 flex items-center gap-1.5 text-xs font-medium',
                    isAvailable ? 'text-success' : 'text-danger',
                  ].join(' ')}
                >
                  {isAvailable ? (
                    <>
                      <PackageCheck className="h-4 w-4" aria-hidden="true" />
                      {activeVariant.stock} unidades en existencia
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Color agotado temporalmente
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Ficha de Calidad y Confección */}
            <div className="mt-5 space-y-2.5 rounded-2xl border border-line/70 bg-canvas/60 p-4 text-xs text-ink-soft">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                <span>
                  <strong>Elaboración:</strong> Tejido 100% a mano con ganchillo y materiales nobles de alta durabilidad.
                </span>
              </div>
              {isDesign && (
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                  <span>
                    <strong>Hecho a pedido:</strong> La foto es una muestra del acabado; tu pieza se teje después de confirmar el encargo.
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                <span>
                  <strong>Personalización:</strong> Colores y detalles adaptables a tu preferencia bajo pedido.
                </span>
              </div>
            </div>

            {/* Precio o cotización */}
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                  {isDesign ? 'Cotización' : 'Precio'}
                </p>
                {showsPrice ? (
                  <p className="font-display text-2xl font-bold text-ink">
                    {formatPrice(product.price)}
                    <span className="ml-1.5 text-xs font-medium text-ink-muted">MXN</span>
                  </p>
                ) : isDesign ? (
                  <>
                    <p className="font-display text-xl font-bold text-ink">
                      Se cotiza a tu medida
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      Según tamaño, color y detalles.
                    </p>
                  </>
                ) : (
                  <p className="font-display text-xl font-bold text-ink">
                    A cotizar por WhatsApp
                  </p>
                )}
              </div>

              {/* Boton compartir */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink-soft shadow-soft transition-all hover:border-lila-300 hover:text-lila-800"
                title="Compartir este producto"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" />
                    <span>¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Compartir</span>
                  </>
                )}
              </button>
            </div>

            {/* Accion Principal WhatsApp */}
            <div className="mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-4 text-center text-sm font-bold text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-whatsapp hover:shadow-whatsapp focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:text-base"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {isDesign ? 'Quiero uno así' : 'Pedir o cotizar por WhatsApp'}
              </a>
              {isDesign ? (
                <p className="mt-2 text-center text-xs text-ink-muted">
                  Cuéntanos tu idea y te compartimos opciones, tiempos y precio.
                </p>
              ) : (
                !isAvailable && (
                  <p className="mt-2 text-center text-xs text-ink-muted">
                    Escríbenos para encargar tu pieza en el próximo lote.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
