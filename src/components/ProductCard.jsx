/**
 * ProductCard.jsx
 * -----------------------------------------------------------------------------
 * Tarjeta de producto.
 *
 * - Piezas artesanales: imagen, marca, titulo, descripcion, precio y WhatsApp.
 * - Estambres y trapillo: ademas muestran el selector de color. Al elegir una
 *   variante se actualizan la foto de vista previa, el codigo/nombre de color y
 *   el mensaje precargado de WhatsApp.
 *
 * IMAGEN: si la foto tiene variantes generadas por `npm run images`, se sirve
 * con <picture> en AVIF/WebP y un LQIP borroso. Si la variante apunta a una
 * imagen sin manifiesto (por ejemplo las fotos de Drive), se usa un <img>
 * simple con `loading="lazy"` y el fallback de la marca si falla.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, Eye, MessageCircle, PackageCheck } from 'lucide-react'
import ColorSwatchPicker from './ColorSwatchPicker'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { getProductWhatsAppUrl } from '../utils/whatsapp'
import { formatPrice } from '../utils/format'
import { AVAILABILITY, getInitialVariantId, getProductStatus, getVariantStatus } from '../utils/availability'
import { CATEGORY_LABELS, FALLBACK_IMAGE, VARIANT_CATEGORIES } from '../config/site'

/** Color de fondo heredado de la marca si el producto no trae uno propio. */
const FALLBACK_COLOR = '#FBF7F1'

/** Etiqueta y color del badge segun lo que se sepa de la disponibilidad. */
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
  // Sin dato no se pinta badge: "no lo se" no es un estado que el comprador
  // necesite leer en la foto. La linea de existencia lo explica abajo.
  [AVAILABILITY.UNKNOWN]: {
    label: null,
    badge: 'bg-sand-100/95 text-ink-soft',
    dot: 'bg-ink-muted',
  },
}

/**
 * Ancho con el que se pinta la foto en cada breakpoint. En movil la tarjeta
 * ocupa media rejilla; desde `md` la foto es una miniatura fija a la izquierda
 * y el contenido va al lado. Debe mantenerse en sync con Materials.
 */
const IMAGE_SIZES = '(min-width: 1024px) 144px, (min-width: 768px) 128px, 45vw'

export default function ProductCard({ product, index = 0, onOpenDetail }) {
  const variants = useMemo(
    () => (Array.isArray(product.variants) ? product.variants : []),
    [product.variants]
  )
  const supportsVariants = variants.length > 0 && VARIANT_CATEGORIES.has(product.category)

  const [activeVariantId, setActiveVariantId] = useState(() => getInitialVariantId(variants))

  // Defensa ante un cambio de producto sin remontar la tarjeta.
  useEffect(() => {
    setActiveVariantId((current) =>
      variants.some((variant) => variant.id === current) ? current : getInitialVariantId(variants)
    )
  }, [variants])

  const activeVariant =
    supportsVariants
      ? variants.find((variant) => variant.id === activeVariantId) ?? variants[0] ?? null
      : null

  // La variante activa manda para imagen, disponibilidad y mensaje de WhatsApp.
  const displayImage = activeVariant ?? product
  const imageUrl = displayImage.imageUrl || FALLBACK_IMAGE
  const imageAlt = activeVariant
    ? `${product.name} en tono ${activeVariant.colorName}`
    : product.name

  const [failedUrl, setFailedUrl] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef(null)
  const [cardRef, isRevealed] = useRevealOnScroll()

  const imageFailed = failedUrl === imageUrl
  const imageSrc = imageFailed ? FALLBACK_IMAGE : imageUrl

  // Al cambiar de variante se resetea el estado de carga. Si la nueva imagen ya
  // estaba en cache, `onLoad` no llega: se comprueba a mano.
  useEffect(() => {
    setImageLoaded(false)
    const node = imageRef.current
    if (node?.complete && node.naturalWidth > 0) setImageLoaded(true)
  }, [imageSrc])

  // Disponibilidad: el producto manda en el badge; el color, en la ficha.
  const productStatus = getProductStatus(product)
  const productStatusStyle = STATUS_STYLES[productStatus]
  const variantStatus = getVariantStatus(activeVariant)
  const whatsappUrl = getProductWhatsAppUrl(product, activeVariant)
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  // El precio solo se publica si la tienda ya dio una cifra real.
  const priceLabel = formatPrice(product.price)

  // Cuando la foto falla se dejan de ofrecer las variantes modernas para no
  // pedir dos veces el mismo recurso inexistente.
  const avifSrcSet = !imageFailed ? displayImage.imageSrcSetAvif : null
  const webpSrcSet = !imageFailed ? displayImage.imageSrcSetWebp : null

  // Escalonado de entrada: las tarjetas de una misma fila entran una tras otra.
  const revealDelay = `${(index % 4) * 70}ms`

  return (
    <article
      ref={cardRef}
      style={{ animationDelay: revealDelay }}
      className={[
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-rest transition-all duration-240 ease-artisan hover:-translate-y-1 hover:border-lila-300 hover:shadow-card md:flex-row',
        'reveal',
        isRevealed ? 'is-visible' : '',
      ].join(' ')}
    >
      {/* ---------------------------------------------------------------
       * Imagen con efecto hover suave y clic para vista rapida.
       * En movil es la foto 4:3 de la tarjeta; desde `md` se convierte en
       * una miniatura de 128-144 px y el contenido pasa al lado.
       * --------------------------------------------------------------- */}
      <div
        onClick={() => onOpenDetail?.(product, activeVariantId)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpenDetail?.(product, activeVariantId)
          }
        }}
        aria-label={`Ver detalles de ${product.name}`}
        className="photo-frame relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-white sm:max-h-44 md:aspect-auto md:max-h-none md:w-32 md:shrink-0 lg:w-36"
      >
        {/* Placeholder borroso (~0.2 KB): cubre el hueco mientras carga la foto */}
        {displayImage.imageLqip && !imageFailed && (
          <img
            src={displayImage.imageLqip}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain blur-sm"
          />
        )}

        <picture>
          {avifSrcSet && (
            <source type="image/avif" srcSet={avifSrcSet} sizes={IMAGE_SIZES} />
          )}
          {webpSrcSet && (
            <source type="image/webp" srcSet={webpSrcSet} sizes={IMAGE_SIZES} />
          )}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            width={displayImage.imageWidth || 800}
            height={displayImage.imageHeight || 1000}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Evita bucles infinitos de onError
              if (imageFailed) return
              setFailedUrl(imageUrl)
            }}
            className={[
              'absolute inset-0 h-full w-full object-contain transition-opacity duration-400 ease-artisan',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        </picture>

        {/* Degradado inferior para legibilidad de las etiquetas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70"
        />

        {/* Pildora flotante "Ver detalle" al pasar el cursor. Se oculta
         * desde `md`: la miniatura es demasiado angosta para ella y la
         * tarjeta ya tiene "Ver ficha". */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-240 group-hover:opacity-100 md:hidden"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-1.5 text-[13px] font-semibold text-ink shadow-soft backdrop-blur-md">
            <Eye className="h-4 w-4 text-lila-800" />
            Ver detalle
          </span>
        </div>

        {/* Tipo real del material: el trapillo no es estambre. */}
        {product.type && (
          <span className="absolute left-2 top-2 inline-flex max-w-[85%] items-center truncate rounded-full bg-surface/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-lila-800 shadow-soft ring-1 ring-white/50 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[13px] md:left-1.5 md:top-1.5 md:max-w-[calc(100%-0.75rem)] md:px-1.5 md:py-0.5 md:text-[9px] md:tracking-normal lg:text-[10px]">
            {product.type}
          </span>
        )}

        {/* Estado de disponibilidad: solo se afirma cuando hay dato real.
         * En la miniatura de `md` baja al pie para no chocar con el tipo. */}
        {productStatusStyle.label && (
          <span
            className={[
              'absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold shadow-soft ring-1 ring-white/50 backdrop-blur-sm sm:right-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[13px] md:right-1.5 md:top-auto md:bottom-3 md:gap-1 md:px-1.5 md:py-0.5 md:text-[9px]',
              productStatusStyle.badge,
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={['h-1.5 w-1.5 rounded-full', productStatusStyle.dot].join(' ')}
            />
            {productStatusStyle.label}
          </span>
        )}

        {/* Franja del color activo: conecta la foto con la variante elegida
         * sin agregar texto ni otra caja. Vive dentro de la foto para que
         * funcione igual en la rejilla y en la lista horizontal. */}
        {supportsVariants && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 border-t border-black/5"
            style={{ backgroundColor: activeVariant?.hexColor || FALLBACK_COLOR }}
          />
        )}
      </div>

      {/* ---------------------------------------------------------------
       * Contenido
       * --------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-4">
        {/* En piezas, la categoria. El acceso a la ficha completa vive junto al
         * titulo: en las tarjetas con selector de color una fila propia solo
         * agregaba aire. */}
        {!supportsVariants && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold">
            <span className="text-clay-deep">{categoryLabel}</span>
            {product.subcategory && (
              <>
                <span aria-hidden="true" className="text-line">
                  /
                </span>
                <span className="font-medium text-ink-muted">{product.subcategory}</span>
              </>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <h3
            onClick={() => onOpenDetail?.(product, activeVariantId)}
            className="line-clamp-2 cursor-pointer font-display text-[1.05rem] font-semibold leading-[1.15] text-ink transition-colors duration-240 group-hover:text-lila-800 group-hover:underline group-hover:decoration-clay/70 group-hover:decoration-2 group-hover:underline-offset-4 min-[360px]:text-[1.15rem] sm:text-[1.4rem] md:text-[1.1rem] lg:text-[1.25rem]"
          >
            {product.brand || product.name}
          </h3>

          <button
            type="button"
            onClick={() => onOpenDetail?.(product, activeVariantId)}
            aria-label={`Ver ficha de ${product.brand || product.name}`}
            className="-mr-1 mt-0.5 inline-flex shrink-0 items-center gap-1 rounded p-1 text-[11px] font-semibold text-ink-muted transition-colors duration-160 ease-artisan hover:text-lila-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-[12px]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline md:hidden lg:inline">Ver ficha</span>
          </button>
        </div>

        {/* La ficha completa cuenta la historia de la marca: la tarjeta se
         * queda con foto, tonos y pedido. La descripcion vive en el modal y en
         * el JSON-LD, no se repite seis veces en la lista. */}

        {/* Un solo separador agrupa la ficha de compra: color, disponibilidad
         * y precio. */}
        <div className="mt-3 border-t-2 border-line/90 pt-3 sm:mt-4 sm:pt-3.5 md:mt-3 md:pt-3">
          {/* -----------------------------------------------------------
           * Variantes de color (solo estambres y trapillo)
           * ----------------------------------------------------------- */}
          {supportsVariants && (
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted sm:text-[12px]">
                  Tono
                </p>
                <p
                  className="truncate text-right font-mono text-[11px] font-medium tabular-nums text-ink-soft sm:text-[13px]"
                  aria-live="polite"
                >
                  {activeVariant ? (
                    <>
                      <span>{activeVariant.colorCode}</span>
                      <span className="sr-only lg:not-sr-only">
                        {' '}
                        · {activeVariant.colorName}
                      </span>
                    </>
                  ) : (
                    'Elige un tono'
                  )}
                </p>
              </div>

              <div className="mt-2 sm:mt-2.5">
                <ColorSwatchPicker
                  variants={variants}
                  activeVariantId={activeVariantId}
                  onChange={setActiveVariantId}
                  onShowAll={() => onOpenDetail?.(product, activeVariantId)}
                  maxVisible={3}
                  compact
                />
              </div>

              {variantStatus === AVAILABILITY.AVAILABLE && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-success">
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  <span>
                    <span className="font-mono tabular-nums">{activeVariant.stock}</span>{' '}
                    disponibles en este color
                  </span>
                </p>
              )}

              {variantStatus === AVAILABILITY.SOLD_OUT && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-danger">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Tono agotado por el momento
                </p>
              )}

              {/* Sin dato de stock no se repite "existencia por confirmar" en
               * cada tarjeta: la seccion lo dice una sola vez. */}
            </div>
          )}

          {/* Precio: solo si la tienda ya publico una cifra. Sin dato, el CTA
           * de WhatsApp es la unica llamada a la accion. */}
          {priceLabel && (
            <div className={supportsVariants ? 'mt-4' : ''}>
              <p className="meta-label">Precio</p>
              <p className="mt-0.5 font-display text-[2rem] font-semibold leading-tight text-ink">
                <span className="tabular-nums">{priceLabel}</span>
                <span className="ml-1 align-middle text-[12px] font-medium text-ink-muted">
                  MXN
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Espaciador flexible: alinea los botones entre tarjetas */}
        <div className="flex-1" />

        {/* -----------------------------------------------------------
         * FLUJO DE PEDIDO
         * El mensaje incluye producto, cantidad y el color activo.
         * ----------------------------------------------------------- */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Pedir por WhatsApp ${product.name}${
            activeVariant ? ` en tono ${activeVariant.colorName}` : ''
          }`}
          title={`Pedir "${product.name}" por WhatsApp`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand px-3 py-2.5 text-center text-[13px] font-bold leading-tight text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-whatsapp hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 sm:px-4 sm:py-3.5 sm:text-[15px] md:mt-3 md:gap-1.5 md:px-3 md:py-2.5 md:text-[13px] lg:px-4 lg:py-3 lg:text-[15px]"
        >
          <MessageCircle className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
          <span className="lg:hidden">Pedir</span>
          <span className="hidden lg:inline">Pedir por WhatsApp</span>
        </a>
      </div>
    </article>
  )
}
