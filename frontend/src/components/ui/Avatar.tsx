import { type ComponentPropsWithRef, useState } from 'react'
import { cn } from '@/lib/cn'

type TamanoAvatar = 'sm' | 'md' | 'lg'

const TAMANOS: Record<TamanoAvatar, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-lg',
}

const PALETA = [
  'bg-marca/15 text-marca',
  'bg-acento/15 text-acento',
  'bg-marca/25 text-marca',
  'bg-acento/25 text-acento',
] as const

const iniciales = (nombre: string): string =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0] ?? '')
    .join('')
    .toUpperCase() || '?'

const colorDe = (nombre: string): string => {
  const suma = [...nombre].reduce((acc, letra) => acc + letra.charCodeAt(0), 0)
  return PALETA[suma % PALETA.length]
}

export interface PropsAvatar extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  nombre: string
  src?: string | null
  size?: TamanoAvatar
}

export const Avatar = ({ nombre, src, size = 'md', className, ...props }: PropsAvatar) => {
  const [srcRoto, setSrcRoto] = useState<string | null>(null)
  const muestraImagen = Boolean(src) && src !== srcRoto

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium',
        TAMANOS[size],
        muestraImagen ? 'bg-superficie' : colorDe(nombre),
        className,
      )}
      {...props}
    >
      {muestraImagen ? (
        <img
          src={src as string}
          alt={nombre}
          className="size-full object-cover"
          onError={() => setSrcRoto(src as string)}
        />
      ) : (
        <span aria-hidden="true">{iniciales(nombre)}</span>
      )}
      {!muestraImagen && <span className="sr-only">{nombre}</span>}
    </div>
  )
}
