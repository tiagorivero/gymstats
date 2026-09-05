import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

type VarianteBadge = 'neutro' | 'exito' | 'alerta' | 'peligro'
type TamanoBadge = 'sm' | 'md'

const VARIANTES: Record<VarianteBadge, string> = {
  neutro: 'bg-superficie text-texto-suave border-borde',
  exito: 'bg-exito/10 text-exito border-exito/30',
  alerta: 'bg-alerta/10 text-alerta border-alerta/30',
  peligro: 'bg-peligro/10 text-peligro border-peligro/30',
}

const TAMANOS: Record<TamanoBadge, string> = {
  sm: 'h-5 px-2 text-[11px]',
  md: 'h-6 px-2.5 text-xs',
}

export interface PropsBadge extends ComponentPropsWithRef<'span'> {
  variant?: VarianteBadge
  size?: TamanoBadge
}

export const Badge = ({ variant = 'neutro', size = 'md', className, ...props }: PropsBadge) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap',
      VARIANTES[variant],
      TAMANOS[size],
      className,
    )}
    {...props}
  />
)
