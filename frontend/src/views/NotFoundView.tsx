import { SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState } from '@/components/ui'

export const NotFoundView = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-superficie p-6">
      <EmptyState
        className="rounded-lg border border-borde bg-fondo"
        icono={<SearchX className="size-6" />}
        titulo="No encontramos esta página"
        descripcion="El enlace puede estar mal escrito o la sección ya no existe."
        accion={<Button onClick={() => navigate('/panel')}>Volver al panel</Button>}
      />
    </div>
  )
}
