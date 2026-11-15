/**
 * ProductDetailModal.jsx
 * -----------------------------------------------------------------------------
 * Modal de Vista Rapida / Detalle de Producto.
 *
 * Permite apreciar la pieza en gran formato antes de cotizar:
 * - Foto en alta resolucion
 * - Calidad y elaboracion del tejido
 * - Selector de color interactivo (solo estambres y trapillo)
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
  Minus,
  PackageCheck,
  Plus,
  Share2,
  Sparkles,
  X,
} from 'lucide-react'
import ColorSwatchPicker from './ColorSwatchPicker'
import { formatPrice } from '../utils/format'
import { AVAILABILITY, getInitialVariantId, getProductStatus, getVariantStatus } from '../utils/availability'
import { getDesignWhatsAppUrl, getProductWhatsAppUrl } from '../utils/whatsapp'
import { CATEGORY_LABELS, FALLBACK_IMAGE, VARIANT_CATEGORIES } from '../config/site'

/** Etiqueta y color del badge de disponibilidad. */
const STATUS_STYLES = {
  [AVAILABILITY.AVAILABLE]: {
    label: 'Disponible',
    badge: 'bg-success-soft/95 text-success',
    dot: 'bg-success',
  },
  [AVAILABILITY.SOLD_OUT]: {
    label: 'Agotado',
    badge: 'bg-danger-soft/95 text-danger',
    dot: 'bg-danger',
  },
  [AVAILABILITY.UNKNOWN]: {
    // Sin dato no se pinta badge: la ficha de abajo lo explica.
    label: null,
    badge: 'bg-sand-100/95 text-ink-soft',
    dot: 'bg-ink-muted',
  },
}

export default function ProductDetailModal({ product, onClose }) {
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants]
  )
  const supportsVariants = variants.length > 0 && VARIANT_CATEGORIES.has(product?.category)

  // Inicializa la variante seleccionada con la primera disponible
  useEffect(() => {
    if (supportsVariants) {
      setSelectedVariantId(getInitialVariantId(variants))
    }
  }, [product, supportsVariants, variants])

  // Cada producto arranca con un ovillo; la cantidad no se hereda entre piezas.
  useEffect(() => {
    setQuantity(1)
  }, [product])

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
  const productStatus = getProductStatus(product)
  const productStatusStyle = STATUS_STYLES[productStatus]
  const variantStatus = getVariantStatus(activeVariant)
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category
  const priceLabel = formatPrice(product.price)
  const whatsappUrl = isDesign
    ? getDesignWhatsAppUrl(product)
    : getProductWhatsAppUrl(product, activeVariant, quantity)

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Manualidades Lua`,
      text: `Mira esta hermosa creación en Manualidades Lua: ${product.name}`,
      // La pagina no tiene ruta por producto: al menos aterriza en la seccion.
      url: `${window.location.origin}${window.location.pathname}#${
        isDesign ? 'disenos' : 'materiales'
      }`,
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
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
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
          <div className="photo-frame relative aspect-4/5 w-full bg-sand-100 md:aspect-auto md:h-full">
            <img
              src={imageUrl}
              alt={`${product.name}${activeVariant ? ` en color ${activeVariant.colorName}` : ''}`}
              className="h-full w-full object-cover"
            />
            {/* Badge: encargo para diseños; disponibilidad solo si hay dato */}
            {(isDesign || productStatusStyle.label) && (
              <span
                className={[
                  'absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold shadow-soft backdrop-blur-sm sm:text-[13px]',
                  isDesign ? 'bg-lila-100/95 text-lila-800' : productStatusStyle.badge,
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'h-1.5 w-1.5 rounded-full',
                    isDesign ? 'bg-lila-700' : productStatusStyle.dot,
                  ].join(' ')}
                />
                {isDesign ? 'Hecho por encargo' : productStatusStyle.label}
              </span>
            )}
          </div>

          {/* Columna Derecha: Informacion y Acciones */}
          <div className="flex flex-col p-6 sm:p-8">
            {/* Categorias */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-lila-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-lila-800">
                {categoryLabel}
              </span>
              {product.subcategory && (
                <span className="rounded-full border border-line/80 px-3 py-1 text-[12px] font-semibold text-ink-muted">
                  {product.subcategory}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full border border-line/80 px-3 py-1 text-[12px] font-semibold text-ink-muted">
                  {product.brand}
                </span>
              )}
            </div>

            <h2
              id="modal-producto-titulo"
              className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-ink sm:text-[2.1rem]"
            >
              {product.name}
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              {product.description}
            </p>

            {/* Selector de variantes (si aplica) */}
            {supportsVariants && (
              <div className="mt-5 border-t border-line/80 pt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="meta-label">Color seleccionado</p>
                  <p className="meta-value text-right">
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

                {variantStatus === AVAILABILITY.AVAILABLE && (
                  <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-success">
                    <PackageCheck className="h-4 w-4" aria-hidden="true" />
                    <span>
                      <span className="font-mono tabular-nums">{activeVariant.stock}</span>{' '}
                      disponibles en este color
                    </span>
                  </p>
                )}

                {variantStatus === AVAILABILITY.SOLD_OUT && (
                  <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-danger">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Color agotado temporalmente
                  </p>
                )}

                {variantStatus === AVAILABILITY.UNKNOWN && (
                  <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-ink-muted">
                    <Info className="h-4 w-4" aria-hidden="true" />
                    Existencia por confirmar
                  </p>
                )}

                {/* Cantidad: se suma al mensaje de WhatsApp, no hay carrito. */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-3">
                  <p className="meta-label">Cantidad (ovillos)</p>
                  <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={quantity <= 1}
                      aria-label="Quitar un ovillo"
                      className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sand-100 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span
                      aria-live="polite"
                      className="min-w-7 text-center font-mono text-[14px] font-bold tabular-nums text-ink"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                      aria-label="Agregar un ovillo"
                      className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sand-100 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha de calidad: solo para piezas tejidas a mano. Los estambres
             * y el trapillo no se tejen, asi que no deben heredar este copy. */}
            {isDesign && (
              <div className="mt-5 space-y-2.5 rounded-xl border border-line/70 bg-canvas/60 p-4 text-[13px] leading-relaxed text-ink-soft">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                  <span>
                    <strong>Elaboración:</strong> Tejido 100% a mano con ganchillo y materiales nobles de alta durabilidad.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                  <span>
                    <strong>Hecho a pedido:</strong> La foto es una muestra del acabado; tu pieza se teje después de confirmar el encargo.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lila-700" />
                  <span>
                    <strong>Personalización:</strong> Colores y detalles adaptables a tu preferencia bajo pedido.
                  </span>
                </div>
              </div>
            )}

            {/* Precio o cotización */}
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
              <div>
                <p className="meta-label">
                  {isDesign ? 'Cotización' : 'Precio'}
                </p>
                {priceLabel ? (
                  <p className="font-display text-[2rem] font-semibold leading-tight text-ink">
                    <span className="tabular-nums">{priceLabel}</span>
                    <span className="ml-1.5 text-[12px] font-medium text-ink-muted">MXN</span>
                  </p>
                ) : isDesign ? (
                  <>
                    <p className="font-display text-[1.35rem] font-semibold text-ink">
                      Se cotiza a tu medida
                    </p>
                    <p className="mt-1 text-[13px] text-ink-muted">
                      Según tamaño, color y detalles.
                    </p>
                  </>
                ) : (
                  <p className="font-display text-[1.05rem] font-semibold text-ink sm:text-[1.2rem]">
                    Precio por WhatsApp
                  </p>
                )}
              </div>

              {/* Boton compartir */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-semibold text-ink-soft shadow-soft transition-all hover:border-lila-300 hover:text-lila-800"
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
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-ink bg-brand px-6 py-4 text-center text-[15px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-whatsapp hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 sm:text-[16px]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {isDesign ? 'Quiero uno así' : 'Pedir por WhatsApp'}
              </a>
              {isDesign ? (
                <p className="mt-2 text-center text-[13px] text-ink-muted">
                  Cuéntanos tu idea y te compartimos opciones, tiempos y precio.
                </p>
              ) : (
                variantStatus === AVAILABILITY.SOLD_OUT && (
                  <p className="mt-2 text-center text-[13px] text-ink-muted">
                    Escríbenos para encargar tu color en el próximo lote.
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
