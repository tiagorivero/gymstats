import { LayoutDashboard, QrCode, Users, type LucideIcon } from 'lucide-react'

export interface ItemPanel {
  etiqueta: string
  ruta: string
  icono: LucideIcon
  exacta?: boolean
}

export const ITEMS_PANEL: ItemPanel[] = [
  { etiqueta: 'Panel', ruta: '/panel', icono: LayoutDashboard, exacta: true },
  { etiqueta: 'Socios', ruta: '/panel/socios', icono: Users },
  { etiqueta: 'Check-in', ruta: '/panel/checkin', icono: QrCode },
]
