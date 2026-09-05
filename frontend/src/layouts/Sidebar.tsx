import { Dumbbell, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Avatar, Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Usuario } from '@/types'
import { ITEMS_PANEL } from './itemsPanel'

interface PropsSidebar {
  usuario: Usuario
  onSalir: () => void
  onNavegar?: () => void
}

export const Sidebar = ({ usuario, onSalir, onNavegar }: PropsSidebar) => (
  <div className="flex h-full w-full flex-col border-r border-borde bg-fondo">
    <div className="flex h-16 items-center gap-2 border-b border-borde px-5">
      <Dumbbell className="size-5 text-marca" aria-hidden="true" />
      <span className="font-titulo text-lg font-semibold">GymStats</span>
    </div>

    <nav className="flex-1 space-y-1 p-3" aria-label="Secciones del panel">
      {ITEMS_PANEL.map(({ etiqueta, ruta, icono: Icono, exacta }) => (
        <NavLink
          key={ruta}
          to={ruta}
          end={exacta}
          onClick={onNavegar}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca',
              isActive
                ? 'bg-marca/10 text-marca'
                : 'text-texto-suave hover:bg-superficie hover:text-texto',
            )
          }
        >
          <Icono className="size-4" aria-hidden="true" />
          {etiqueta}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-borde p-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <Avatar nombre={usuario.nombre} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{usuario.nombre}</p>
          <p className="truncate text-xs text-texto-suave">{usuario.email}</p>
        </div>
      </div>
      <Button variant="fantasma" size="sm" className="w-full justify-start" onClick={onSalir}>
        <LogOut className="size-4" aria-hidden="true" />
        Cerrar sesión
      </Button>
    </div>
  </div>
)
