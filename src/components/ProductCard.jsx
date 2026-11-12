/**
 * ProductCard.jsx
 * -----------------------------------------------------------------------------
 * Tarjeta de producto.
 *
 * - Piezas artesanales: imagen, marca, titulo, descripcion, precio y WhatsApp.
 * - Estambres e hilos: ademas muestran el selector de color. Al elegir una
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
import {
  CATEGORY_LABELS,
  FALLBACK_IMAGE,
  PRICED_CATEGORIES,
  VARIANT_CATEGORIES,
} from '../config/site'

/** Color de fondo heredado de la marca si el producto no trae uno propio. */
const FALLBACK_COLOR = '#FBF7F1'

/**
 * Ancho con el que se pinta la tarjeta en cada breakpoint. Debe mantenerse en
 * sync con las columnas del grid de Materials: 1 en movil, 2 en tablet y 4 en
 * pantallas anchas.
 */
const IMAGE_SIZES = '(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw'

/** Primera variante con stock; si todas estan agotadas, la primera. */
function getInitialVariantId(variants) {
  const available = variants.find((variant) => variant.stock > 0)
  return (available ?? variants[0])?.id ?? null
}

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

  // La variante activa manda para imagen, stock y mensaje de WhatsApp.
  const displayImage = activeVariant ?? product
  const imageUrl = displayImage.imageUrl || FALLBACK_IMAGE
  const imageAlt = activeVariant
    ? `${product.name} en color ${activeVariant.colorName}`
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

  const isAvailable = activeVariant ? activeVariant.stock > 0 : Boolean(product.available)
  const whatsappUrl = getProductWhatsAppUrl(product, activeVariant)
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  // Solo los hilos publican precio. Manualidades y estambres se cotizan segun
  // tamano, color y personalizacion; mostrar una cifra fija seria enganoso.
  const showsPrice = PRICED_CATEGORIES.includes(product.category)

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
        'group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-240 ease-artisan hover:-translate-y-1.5 hover:border-lila-300 hover:shadow-lift',
        'reveal',
        isRevealed ? 'is-visible' : '',
      ].join(' ')}
    >
      {/* ---------------------------------------------------------------
       * Imagen con efecto hover suave y clic para vista rapida
       * --------------------------------------------------------------- */}
      <div
        onClick={() => onOpenDetail?.(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpenDetail?.(product)
          }
        }}
        aria-label={`Ver detalles de ${product.name}`}
        className="relative aspect-4/5 w-full cursor-pointer overflow-hidden"
        style={{ backgroundColor: displayImage.imageColor || FALLBACK_COLOR }}
      >
        {/* Placeholder borroso (~0.2 KB): cubre el hueco mientras carga la foto */}
        {displayImage.imageLqip && !imageFailed && (
          <img
            src={displayImage.imageLqip}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
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
              'absolute inset-0 h-full w-full object-cover transition-all duration-400 ease-artisan group-hover:scale-[1.07]',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        </picture>

        {/* Degradado inferior para legibilidad de las etiquetas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70"
        />

        {/* Pildora flotante "Ver detalle" al pasar el cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-240 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur-md">
            <Eye className="h-3.5 w-3.5 text-lila-800" />
            Ver detalle
          </span>
        </div>

        {/* Marca: solo si el producto la tiene. La categoria ya se muestra
         * como chip bajo la foto, asi que repetirla aqui era ruido. */}
        {product.brand && (
          <span className="absolute left-3 top-3 inline-flex max-w-[70%] items-center truncate rounded-full bg-surface/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-lila-800 shadow-soft backdrop-blur-sm sm:left-4 sm:top-4 sm:text-xs">
            {product.brand}
          </span>
        )}

        {/* Estado de disponibilidad */}
        <span
          className={[
            'absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold shadow-soft backdrop-blur-sm sm:right-4 sm:top-4 sm:text-xs',
            isAvailable ? 'bg-success-soft/95 text-success' : 'bg-danger-soft/95 text-danger',
          ].join(' ')}
        >
          <span
            aria-hidden="true"
            className={[
              'h-1.5 w-1.5 rounded-full',
              isAvailable ? 'bg-success' : 'bg-danger',
            ].join(' ')}
          />
          {isAvailable ? 'Disponible' : 'Agotado'}
        </span>
      </div>

      {/* ---------------------------------------------------------------
       * Contenido
       * --------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Categoria / subcategoria y numero de colores */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-lila-800">
            {categoryLabel}
          </span>
          {product.subcategory && (
            <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
              {product.subcategory}
            </span>
          )}
          {supportsVariants && (
            <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
              {variants.length} colores
            </span>
          )}
        </div>

        <h3
          onClick={() => onOpenDetail?.(product)}
          className="mt-2.5 cursor-pointer font-display text-lg font-semibold leading-snug text-ink transition-colors duration-240 group-hover:text-lila-800 sm:text-xl"
        >
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>

        {/* -----------------------------------------------------------
         * Variantes de color (solo estambres e hilos)
         * ----------------------------------------------------------- */}
        {supportsVariants && (
          <div className="mt-4 rounded-2xl border border-line bg-sand-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                Color
              </p>
              <p className="text-right text-xs font-semibold text-ink-soft" aria-live="polite">
                {activeVariant
                  ? `${activeVariant.colorCode} · ${activeVariant.colorName}`
                  : 'Elige un color'}
              </p>
            </div>

            <div className="mt-2.5">
              <ColorSwatchPicker
                variants={variants}
                activeVariantId={activeVariantId}
                onChange={setActiveVariantId}
              />
            </div>

            <p
              className={[
                'mt-2.5 flex items-center gap-1.5 text-[11px] font-medium',
                isAvailable ? 'text-success' : 'text-danger',
              ].join(' ')}
            >
              {isAvailable ? (
                <>
                  <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {activeVariant.stock} disponibles en este color
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Color agotado por el momento
                </>
              )}
            </p>
          </div>
        )}

        {/* Precio: solo hilos. La explicacion de las piezas a cotizar vive una
         * sola vez en el encabezado del catalogo, no en cada tarjeta. */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
            Precio
          </p>
          {showsPrice ? (
            <p className="font-display text-xl font-semibold leading-tight text-ink">
              {formatPrice(product.price)}
              <span className="ml-1 align-middle text-[11px] font-medium text-ink-muted">
                MXN
              </span>
            </p>
          ) : (
            <p className="font-display text-lg font-semibold leading-tight text-ink">
              A cotizar
            </p>
          )}
        </div>

        {/* Espaciador flexible: alinea los botones entre tarjetas */}
        <div className="flex-1" />

        {/* -----------------------------------------------------------
         * FLUJO DE WHATSAPP
         * El mensaje incluye el producto y, si hay variante activa, su
         * codigo y nombre de color.
         * ----------------------------------------------------------- */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Pedir por WhatsApp ${product.name}${
            activeVariant ? ` en color ${activeVariant.colorName}` : ''
          }`}
          title={`Pedir "${product.name}" por WhatsApp`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 text-center text-[13px] font-bold leading-tight text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-whatsapp hover:shadow-whatsapp focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 sm:text-sm"
        >
          <MessageCircle className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Pedir por WhatsApp
        </a>

        {/* Aviso para productos agotados */}
        {!isAvailable && (
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-ink-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Escríbenos para saber cuándo habrá nuevamente
          </p>
        )}
      </div>
    </article>
  )
}
