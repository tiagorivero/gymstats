import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { cn } from '@/lib/cn'

type TamanoInput = 'sm' | 'md' | 'lg'

const TAMANOS: Record<TamanoInput, string> = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

const SANGRIA_CON_ICONO: Record<TamanoInput, string> = {
  sm: 'pl-8',
  md: 'pl-10',
  lg: 'pl-11',
}

export interface PropsInput extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: TamanoInput
  error?: string
  icono?: ReactNode
}

export const Input = ({ size = 'md', error, icono, className, id, ...props }: PropsInput) => {
  const generado = useId()
  const idCampo = id ?? generado
  const idError = `${idCampo}-error`

  return (
    <div className="w-full">
      <div className="relative">
        {icono && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-texto-suave"
            aria-hidden="true"
          >
            {icono}
          </span>
        )}
        <input
          id={idCampo}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          className={cn(
            'w-full rounded border bg-fondo px-3 text-texto placeholder:text-texto-suave',
            'transition-colors focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-fondo',
            'disabled:cursor-not-allowed disabled:bg-superficie disabled:opacity-60',
            TAMANOS[size],
            icono && SANGRIA_CON_ICONO[size],
            error
              ? 'border-peligro focus-visible:ring-peligro'
              : 'border-borde focus-visible:ring-marca',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={idError} className="mt-1.5 text-sm text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
