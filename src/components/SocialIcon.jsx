import { Facebook, Instagram } from 'lucide-react'

/** Mapa interno de componentes de icono por identificador de red social. */
const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
}

export default function SocialIcon({ id, className = 'h-4 w-4', ...props }) {
  const Icon = SOCIAL_ICONS[id]
  if (!Icon) return null
  return <Icon className={className} aria-hidden="true" {...props} />
}
