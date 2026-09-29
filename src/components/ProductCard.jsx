/**
 * ProductCard.jsx
 * -----------------------------------------------------------------------------
 * Tarjeta de producto con imagen responsiva, etiquetas, descripcion y el boton
 * de cotizacion por WhatsApp con mensaje prellenado.
 *
 * IMAGEN: se sirve con <picture> y tres resoluciones (400/600/800) en AVIF y
 * WebP, de modo que cada dispositivo descarga solo la que necesita (~16-43 KB
 * en vez de los ~78 KB de una unica version). Mientras llega la foto se pinta un
 * placeholder borroso de 0.2 KB sobre el color promedio de la pieza.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Tag, Clock } from 'lucide-react'
import { getProductWhatsAppUrl } from '../utils/whatsapp'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

/** Imagen de respaldo si la URL del producto falla. */
const FALLBACK_IMAGE = '/images/product-placeholder.svg'

/** Color de fondo heredado de la marca si el producto no trae uno propio. */
const FALLBACK_COLOR = '#FAF8FE'

/**
 * Ancho con el que se pinta la tarjeta en cada breakpoint. Debe mantenerse en
 * sync con las columnas del grid de ProductGrid: si cambian, el navegador
 * elegira una resolucion equivocada (de mas, o peor: de menos).
 */
const IMAGE_SIZES = '(min-width: 1280px) 290px, (min-width: 1024px) 33vw, (min-width: 640px) 45vw, 92vw'

export default function ProductCard({ product, index = 0 }) {
  // Estado local para el fallback de imagen
  const [imageSrc, setImageSrc] = useState(product.imageUrl || FALLBACK_IMAGE)
  const [imageFailed, setImageFailed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageRef = useRef(null)
  const [cardRef, isRevealed] = useRevealOnScroll()

  // Si la foto ya estaba en cache, `onLoad` nunca llega: se comprueba a mano.
  useEffect(() => {
    if (imageRef.current?.complete) setImageLoaded(true)
  }, [])

  const whatsappUrl = getProductWhatsAppUrl(product)
  const isAvailable = product.available

  // Cuando la foto no carga se dejan de ofrecer las variantes modernas para no
  // pedir dos veces el mismo recurso inexistente.
  const avifSrcSet = !imageFailed ? product.imageSrcSetAvif : null
  const webpSrcSet = !imageFailed ? product.imageSrcSetWebp : null

  // Escalonado de entrada: las tarjetas de una misma fila entran una tras otra.
  const revealDelay = `${(index % 4) * 70}ms`

  return (
    <article
      ref={cardRef}
      style={{ animationDelay: revealDelay }}
      className={[
        'group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-500 ease-artisan hover:-translate-y-1.5 hover:border-lila-300 hover:shadow-lift',
        'reveal',
        isRevealed ? 'is-visible' : '',
      ].join(' ')}
    >
      {/* ---------------------------------------------------------------
       * Imagen con efecto hover suave
       * --------------------------------------------------------------- */}
      <div
        className="relative aspect-4/5 w-full overflow-hidden"
        style={{ backgroundColor: product.imageColor || FALLBACK_COLOR }}
      >
        {/* Placeholder borroso (~0.2 KB): cubre el hueco mientras carga la foto */}
        {product.imageLqip && !imageFailed && (
          <img
            src={product.imageLqip}
            alt=""
            aria-hidden="true"
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
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={product.imageWidth || 800}
            height={product.imageHeight || 1000}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Evita bucles infinitos de onError
              if (imageFailed) return
              setImageFailed(true)
              setImageSrc(FALLBACK_IMAGE)
              // El SVG de respaldo tambien tiene que ser visible.
              setImageLoaded(true)
            }}
            className={[
              'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-artisan group-hover:scale-[1.07]',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        </picture>

        {/* Degradado inferior para legibilidad de las etiquetas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70"
        />

        {/* Etiqueta de categoria */}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-surface/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-lila-700 shadow-soft backdrop-blur-sm sm:left-4 sm:top-4 sm:text-xs">
          {product.category}
        </span>

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
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-lila-700 sm:text-xl">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>

        {/* Etiquetas del producto */}
        {product.tags?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-lila-50 px-2.5 py-1 text-[11px] font-medium text-lila-700 ring-1 ring-inset ring-line"
              >
                <Tag className="h-3 w-3" aria-hidden="true" />
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Espaciador flexible: alinea los botones entre tarjetas */}
        <div className="flex-1" />

        {/* -----------------------------------------------------------
         * FLUJO DE WHATSAPP
         * Abre wa.me con el mensaje prellenado que incluye el nombre
         * exacto del producto para pedir precio y personalizacion.
         * ----------------------------------------------------------- */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Preguntar y cotizar por WhatsApp el producto ${product.name}`}
          title={`Cotizar "${product.name}" por WhatsApp`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 text-center text-[13px] font-bold leading-tight text-white shadow-brand transition-all duration-300 ease-artisan hover:-translate-y-0.5 hover:bg-[#25D366] hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 sm:text-sm"
        >
          <MessageCircle className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          💬 Preguntar y cotizar por WhatsApp
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
