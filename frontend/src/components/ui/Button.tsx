import { LoaderCircle } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'peligro'
type TamanoBoton = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-fondo ' +
  'disabled:pointer-events-none disabled:opacity-50'

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-marca text-marca-contraste hover:bg-marca/90',
  secundario: 'border border-borde bg-superficie text-texto hover:bg-borde/60',
  fantasma: 'bg-transparent text-texto-suave hover:bg-superficie hover:text-texto',
  peligro: 'bg-peligro text-marca-contraste hover:bg-peligro/90',
}

const TAMANOS: Record<TamanoBoton, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export interface PropsBoton extends ComponentPropsWithRef<'button'> {
  variant?: VarianteBoton
  size?: TamanoBoton
  cargando?: boolean
}

export const Button = ({
  variant = 'primario',
  size = 'md',
  cargando = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: PropsBoton) => (
  <button
    type={type}
    className={cn(BASE, VARIANTES[variant], TAMANOS[size], className)}
    disabled={disabled || cargando}
    aria-busy={cargando || undefined}
    {...props}
  >
    {cargando && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
    {children}
  </button>
)
