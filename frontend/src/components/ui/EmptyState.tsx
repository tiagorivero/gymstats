import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type TamanoVacio = 'sm' | 'md'

const TAMANOS: Record<TamanoVacio, string> = {
  sm: 'py-8 gap-2',
  md: 'py-14 gap-3',
}

const CIRCULOS: Record<TamanoVacio, string> = {
  sm: 'size-10',
  md: 'size-14',
}

export interface PropsEmptyState extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  icono: ReactNode
  titulo: string
  descripcion?: string
  accion?: ReactNode
  size?: TamanoVacio
}

export const EmptyState = ({
  icono,
  titulo,
  descripcion,
  accion,
  size = 'md',
  className,
  ...props
}: PropsEmptyState) => (
  <div
    className={cn('flex flex-col items-center justify-center px-6 text-center', TAMANOS[size], className)}
    {...props}
  >
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-superficie text-texto-suave',
        CIRCULOS[size],
      )}
      aria-hidden="true"
    >
      {icono}
    </div>
    <h3 className="text-base font-semibold text-texto">{titulo}</h3>
    {descripcion && <p className="max-w-sm text-sm text-texto-suave">{descripcion}</p>}
    {accion && <div className="mt-2">{accion}</div>}
  </div>
)
