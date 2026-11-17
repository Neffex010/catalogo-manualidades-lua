/**
 * StoreInfo.jsx
 * -----------------------------------------------------------------------------
 * Informacion de la tienda fisica: direccion, horario, WhatsApp, redes, marcas
 * y servicios.
 *
 * Es la seccion a la que apunta "Tienda" en la navbar. La direccion se enlaza
 * a Google Maps para que el cliente pueda llegar sin copiar la direccion a
 * mano. Todos los datos viven en `config/site.js`.
 * -----------------------------------------------------------------------------
 */

import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Scissors,
} from 'lucide-react'
import {
  CONTACT,
  MATERIAL_BRANDS,
  SOCIAL_LINKS,
  STORE_EXTRAS,
  STORE_SERVICES,
} from '../config/site'
import colorCatalog from '../data/colorCatalog.json'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'
import SocialIcon from './SocialIcon'

/** Fila de contacto reutilizable. */
function ContactLink({ icon: Icon, label, value, href, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-2.5 rounded-xl border border-line/70 bg-sand-50/70 px-3 py-2.5 transition-all duration-160 ease-artisan hover:-translate-y-0.5 hover:border-lila-300 hover:bg-sand-50 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lila-100 text-lila-800">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-bold uppercase tracking-[0.1em] text-ink-muted">
          {label}
        </span>
        <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-lila-800">
          {value}
        </span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-160 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lila-800"
        aria-hidden="true"
      />
    </a>
  )
}

/** Etiqueta compacta para marcas, extras y servicios. */
function Tag({ children }) {
  return (
    <span className="rounded-full border border-line bg-sand-50 px-2.5 py-1 text-[12.5px] font-semibold text-ink-soft">
      {children}
    </span>
  )
}

export default function StoreInfo() {
  // Las marcas con carta completa salen del manifiesto de tonos, no de una
  // lista paralela: asi Tienda y Materiales no se contradicen.
  const catalogBrands = colorCatalog.brands
  const catalogNames = new Set(catalogBrands.map((brand) => brand.name))
  const otherBrands = MATERIAL_BRANDS.filter((brand) => !catalogNames.has(brand))

  return (
    <section
      id="tienda"
      aria-labelledby="tienda-titulo"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="relative border-t-2 border-ink/15 pt-8 sm:pt-10">
        <div aria-hidden="true" className="texture-linen pointer-events-none absolute inset-0 opacity-70" />

        <div className="relative">
          {/* Encabezado */}
          <div className="flex max-w-2xl gap-4 sm:gap-6">
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 font-mono text-[13px] font-semibold tracking-[0.18em] text-clay"
            >
              03
            </span>
            <div>
              <p className="eyebrow">En persona</p>
              <h2
                id="tienda-titulo"
                className="mt-2.5 font-display text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-[3.1rem] lg:text-[3.5rem]"
              >
                Ven a conocer la tienda
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft sm:text-[17px]">
                Compara tonos y toca las texturas.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8">
            {/* Direccion y contacto: una sola tarjeta. Antes eran dos y el
             * telefono repetia el mismo numero que WhatsApp. */}
            <div className="rounded-[1.35rem] border-2 border-ink/10 bg-surface p-5 shadow-pop-sand sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p className="meta-label flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-lila-700" aria-hidden="true" />
                    Dirección
                  </p>

                  <p className="mt-2.5 font-display text-[1.35rem] font-semibold leading-snug text-ink sm:text-[1.5rem]">
                    {CONTACT.address.street}
                  </p>
                  <p className="mt-1 text-[14.5px] text-ink-soft">{CONTACT.address.reference}</p>
                  <p className="text-[14.5px] text-ink-soft">{CONTACT.address.city}</p>

                  <p className="mt-3 flex items-center gap-2 text-[14.5px] font-medium text-ink-soft">
                    <Clock className="h-4 w-4 shrink-0 text-lila-700" aria-hidden="true" />
                    Horario: {CONTACT.hours}
                  </p>

                  <a
                    href={CONTACT.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 inline-flex w-fit items-center gap-2 rounded-xl border-2 border-ink bg-brand px-4 py-2.5 text-[14px] font-bold text-white shadow-pop transition-all duration-240 ease-artisan hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lila-800 hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Cómo llegar
                  </a>
                </div>

                <div className="sm:border-l sm:border-line/70 sm:pl-8">
                  <p className="meta-label flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5 text-lila-700" aria-hidden="true" />
                    WhatsApp y redes
                  </p>

                  <div className="mt-2.5 flex flex-col gap-2">
                    {/* El telefono es el mismo numero de WhatsApp: un solo
                     * acceso y sin publicar la cifra en la pagina. */}
                    <ContactLink
                      icon={MessageCircle}
                      label="WhatsApp"
                      value="Escríbeme"
                      href={getGeneralWhatsAppUrl()}
                      external
                    />

                    {SOCIAL_LINKS.map(({ id, label, handle, href }) => (
                      <ContactLink
                        key={id}
                        icon={(props) => <SocialIcon id={id} {...props} />}
                        label={label}
                        value={handle}
                        href={href}
                        external
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Marcas y extras: un solo bloque de etiquetas, sin cajas ni
             * bordes internos. Las marcas con carta se resumen en el enlace. */}
            <div className="rounded-[1.35rem] border border-line/80 bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="meta-label flex items-center gap-1.5">
                  <Scissors className="h-3.5 w-3.5 text-lila-700" aria-hidden="true" />
                  Marcas y materiales
                </p>

                <a
                  href="#materiales"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-lila-800 underline decoration-clay/50 decoration-2 underline-offset-4 transition-colors duration-160 ease-artisan hover:text-ink hover:decoration-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  Carta de color completa
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-clay-deep">
                  También en tienda
                </span>
                {otherBrands.map((brand) => (
                  <Tag key={brand}>{brand}</Tag>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-clay-deep">
                  También hay
                </span>
                {[...STORE_EXTRAS, ...STORE_SERVICES].map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
