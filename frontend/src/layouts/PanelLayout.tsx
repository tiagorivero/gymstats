import { Dumbbell, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui'
import { haySesion, useLogout, usePerfil } from '@/hooks/useAuth'
import { EsqueletoPanel } from './EsqueletoPanel'
import { Sidebar } from './Sidebar'

export const PanelLayout = () => {
  const { data: usuario, isError } = usePerfil()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const salir = useLogout()

  if (!haySesion() || isError) return <Navigate to="/login" replace />
  if (!usuario) return <EsqueletoPanel />

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <div className="min-h-screen bg-superficie">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        <Sidebar usuario={usuario} onSalir={salir} />
      </aside>

      {menuAbierto && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Cerrar el menú"
            className="fixed inset-0 z-40 bg-texto/40"
            onClick={cerrarMenu}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64">
            <Sidebar usuario={usuario} onSalir={salir} onNavegar={cerrarMenu} />
            <Button
              variant="fantasma"
              size="sm"
              aria-label="Cerrar el menú"
              className="absolute right-2 top-3"
              onClick={cerrarMenu}
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-borde bg-fondo px-4 lg:hidden">
          <Button
            variant="fantasma"
            size="sm"
            aria-label="Abrir el menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <Dumbbell className="size-5 text-marca" aria-hidden="true" />
          <span className="font-titulo text-base font-semibold">GymStats</span>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
