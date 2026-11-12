/**
 * StoreInfo.jsx
 * -----------------------------------------------------------------------------
 * Informacion de la tienda fisica: direccion, horario, telefono, redes, marcas
 * y servicios.
 *
 * Es la seccion a la que apunta "Tienda" en la navbar. La direccion se enlaza
 * a Google Maps para que el cliente pueda llegar sin copiar la direccion a
 * mano. Todos los datos viven en `config/site.js`.
 * -----------------------------------------------------------------------------
 */

import {
  ArrowUpRight,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Scissors,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import {
  CONTACT,
  MATERIAL_BRANDS,
  SOCIAL_LINKS,
  STORE_EXTRAS,
  STORE_SERVICES,
} from '../config/site'
import { getGeneralWhatsAppUrl } from '../utils/whatsapp'
import SocialIcon from './SocialIcon'

/** Fila de contacto reutilizable. */
function ContactLink({ icon: Icon, label, value, href, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-3 rounded-2xl border border-line/70 bg-surface px-3.5 py-3 transition-all duration-160 ease-artisan hover:-translate-y-0.5 hover:border-lila-300 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lila-100 text-lila-800">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-muted">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-ink group-hover:text-lila-800">
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
    <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft">
      {children}
    </span>
  )
}

export default function StoreInfo() {
  return (
    <section
      id="tienda"
      aria-labelledby="tienda-titulo"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-4xl border border-line bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
        <div aria-hidden="true" className="texture-linen pointer-events-none absolute inset-0" />

        <div className="relative">
          {/* Encabezado */}
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lila-800">
              Visítanos
            </p>
            <h2
              id="tienda-titulo"
              className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Ven a conocer la tienda
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              Compara tonos, toca las texturas y elige el material para tu próximo proyecto.
            </p>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-5">
            {/* Direccion y horario */}
            <div className="flex flex-col justify-between rounded-3xl border border-line bg-sand-50 p-5 lg:col-span-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lila-100 text-lila-800">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                    Dirección
                  </p>
                </div>

                <p className="mt-3 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                  {CONTACT.address.street}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{CONTACT.address.reference}</p>
                <p className="text-sm text-ink-soft">{CONTACT.address.city}</p>

                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <Clock className="h-4 w-4 shrink-0 text-lila-700" aria-hidden="true" />
                  Horario: {CONTACT.hours}
                </p>
              </div>

              <a
                href={CONTACT.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all duration-240 ease-artisan hover:-translate-y-0.5 hover:bg-lila-800 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-lila-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Cómo llegar
              </a>
            </div>

            {/* Contacto directo */}
            <div className="rounded-3xl border border-line bg-sand-50 p-5 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                Contacto y atención
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <ContactLink
                  icon={Phone}
                  label="Teléfono"
                  value={CONTACT.phone.display}
                  href={CONTACT.phone.href}
                />
                <ContactLink
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={CONTACT.whatsappDisplay}
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

            {/* Marcas, extras y servicios */}
            <div className="rounded-3xl border border-line bg-sand-50 p-5 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-lila-100 text-lila-800">
                  <Scissors className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                  Marcas de hilo y estambre
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {MATERIAL_BRANDS.map((brand) => (
                  <Tag key={brand}>{brand}</Tag>
                ))}
              </div>

              <div className="mt-5 grid gap-5 border-t border-line pt-4 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                    <ShoppingBag className="h-4 w-4 text-lila-700" aria-hidden="true" />
                    También encontrarás
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STORE_EXTRAS.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                    <Sparkles className="h-4 w-4 text-lila-700" aria-hidden="true" />
                    Servicios
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {STORE_SERVICES.map((service) => (
                      <li
                        key={service}
                        className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-lila-600"
                        />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
