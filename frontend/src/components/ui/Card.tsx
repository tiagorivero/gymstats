import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

type VarianteCard = 'superficie' | 'contorno'
type TamanoCard = 'sm' | 'md' | 'lg'

const VARIANTES: Record<VarianteCard, string> = {
  superficie: 'bg-fondo border border-borde shadow-sm',
  contorno: 'bg-transparent border border-borde',
}

const RELLENOS: Record<TamanoCard, string> = {
  sm: 'px-4 py-3',
  md: 'px-5 py-4',
  lg: 'px-6 py-5',
}

interface PropsCard extends ComponentPropsWithRef<'div'> {
  variant?: VarianteCard
}

interface PropsSeccion extends ComponentPropsWithRef<'div'> {
  size?: TamanoCard
}

const Raiz = ({ variant = 'superficie', className, ...props }: PropsCard) => (
  <div className={cn('rounded-lg', VARIANTES[variant], className)} {...props} />
)

const Header = ({ size = 'md', className, ...props }: PropsSeccion) => (
  <div
    className={cn('flex items-center justify-between gap-3 border-b border-borde', RELLENOS[size], className)}
    {...props}
  />
)

const Body = ({ size = 'md', className, ...props }: PropsSeccion) => (
  <div className={cn(RELLENOS[size], className)} {...props} />
)

export const Card = Object.assign(Raiz, { Header, Body })
