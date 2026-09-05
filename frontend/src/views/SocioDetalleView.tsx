import { useParams } from 'react-router-dom'

export const SocioDetalleView = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <section>
      <h1 className="text-2xl font-semibold">Ficha del socio</h1>
      <p className="mt-1 text-sm text-texto-suave">Pendiente: ficha del socio {id}.</p>
    </section>
  )
}
