import { api } from '@/config/axios'
import type {
  ActualizarSocio,
  CrearSocio,
  FichaSocio,
  FiltrosSocios,
  Paginado,
  Socio,
} from '@/types'
import { pedir } from './error'

const RUTA = '/api/socios'

export const listar = (filtros: FiltrosSocios = {}): Promise<Paginado<Socio>> =>
  pedir(() => api.get<Paginado<Socio>>(RUTA, { params: filtros }))

export const obtener = (id: string): Promise<FichaSocio> =>
  pedir(() => api.get<FichaSocio>(`${RUTA}/${id}`))

export const crear = (datos: CrearSocio): Promise<Socio> =>
  pedir(() => api.post<Socio>(RUTA, datos))

export const actualizar = (id: string, datos: ActualizarSocio): Promise<Socio> =>
  pedir(() => api.patch<Socio>(`${RUTA}/${id}`, datos))

export const darDeBaja = (id: string): Promise<Socio> =>
  pedir(() => api.post<Socio>(`${RUTA}/${id}/baja`))

export const reactivar = (id: string): Promise<Socio> =>
  pedir(() => api.post<Socio>(`${RUTA}/${id}/reactivar`))

export const qr = async (id: string): Promise<string> => {
  const { dataUrl } = await pedir(() => api.get<{ dataUrl: string }>(`${RUTA}/${id}/qr`))
  return dataUrl
}
