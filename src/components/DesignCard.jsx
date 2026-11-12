/**
 * DesignCard.jsx
 * -----------------------------------------------------------------------------
 * Tarjeta del PORTAFOLIO de diseños tejidos a pedido.
 *
 * No es un producto de inventario: no muestra precio, stock ni etiqueta de
 * disponibilidad. La foto presenta la calidad del trabajo y el unico objetivo
 * de la tarjeta es abrir el detalle o iniciar una conversacion de WhatsApp.
 *
 * La imagen se sirve con el mismo manifiesto que ProductCard (AVIF/WebP, LQIP y
 * color dominante) para que el portafolio cargue igual de rapido sin duplicar
 * el pipeline de imagenes.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react'
import { Eye, MessageCircle } from 'lucide-react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { getDesignWhatsAppUrl } from '../utils/whatsapp'
import { FALLBACK_IMAGE } from '../config/site'

/** Fondo heredado de la marca si la foto no trae color dominante. */
const FALLBACK_COLOR = '#FBF7F1'

/**
 * Ancho aproximado de la tarjeta por breakpoint. Debe acompanar a las columnas
 * del grid de Portfolio: 2 en movil, 2 en tablet, 3 en escritorio y 4 en
 * pantallas anchas.
 */
const IMAGE_SIZES =
  '(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 45vw, 46vw'

export default function DesignCard({ design, index = 0, onOpenDetail }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef(null)
  const [cardRef, isRevealed] = useRevealOnScroll()

  const imageUrl = design.imageUrl || FALLBACK_IMAGE
  const imageFailed = failedUrl === imageUrl
  const imageSrc = imageFailed ? FALLBACK_IMAGE : imageUrl

  // Al cambiar de diseño se reinicia la carga. Si la foto ya estaba en cache,
  // `onLoad` no llega: se comprueba a mano.
  useEffect(() => {
    setImageLoaded(false)
    const node = imageRef.current
    if (node?.complete && node.naturalWidth > 0) setImageLoaded(true)
  }, [imageSrc])

  const avifSrcSet = !imageFailed ? design.imageSrcSetAvif : null
  const webpSrcSet = !imageFailed ? design.imageSrcSetWebp : null
  const whatsappUrl = getDesignWhatsAppUrl(design)
  const revealDelay = `${(index % 4) * 70}ms`

  const openDetail = () => onOpenDetail?.(design)

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
       * Foto: la protagonista del portafolio
       * --------------------------------------------------------------- */}
      <div
        onClick={openDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openDetail()
          }
        }}
        aria-label={`Ver detalles de ${design.name}`}
        className="relative aspect-4/5 w-full cursor-pointer overflow-hidden"
        style={{ backgroundColor: design.imageColor || FALLBACK_COLOR }}
      >
        {design.imageLqip && !imageFailed && (
          <img
            src={design.imageLqip}
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
            alt={design.name}
            loading="lazy"
            decoding="async"
            width={design.imageWidth || 800}
            height={design.imageHeight || 1000}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (imageFailed) return
              setFailedUrl(imageUrl)
            }}
            className={[
              'absolute inset-0 h-full w-full object-cover transition-all duration-400 ease-artisan group-hover:scale-[1.05]',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        </picture>

        {/* Degradado inferior: da contraste a la pildora de detalle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-60"
        />

        {/* Pildora flotante al pasar el cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-240 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur-md">
            <Eye className="h-3.5 w-3.5 text-lila-800" />
            Ver detalle
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------
       * Contenido
       * --------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-wide text-lila-800 sm:text-[11px]">
          {design.subcategory ?? 'Hecho a mano'}
        </p>

        <h3
          onClick={openDetail}
          className="mt-1 cursor-pointer font-display text-sm font-semibold leading-snug text-ink transition-colors duration-240 group-hover:text-lila-800 sm:text-lg"
        >
          {design.name}
        </h3>

        <p className="mt-1.5 hidden line-clamp-2 text-sm leading-relaxed text-ink-soft sm:block">
          {design.description}
        </p>

        {/* Alinea el boton al pie de todas las tarjetas */}
        <div className="flex-1" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Quiero un diseño como ${design.name}`}
          title={`Pedir un diseño como "${design.name}" por WhatsApp`}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2.5 text-center text-[11px] font-bold leading-tight text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-whatsapp hover:shadow-whatsapp focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 sm:mt-4 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Quiero uno así
        </a>
      </div>
    </article>
  )
}
