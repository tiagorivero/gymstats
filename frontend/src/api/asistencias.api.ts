import { api } from '@/config/axios'
import type { AsistenciaConSocio, ResultadoCheckin } from '@/types'
import { pedir } from './error'

const RUTA = '/api/asistencias'

export const checkin = (qrToken: string): Promise<ResultadoCheckin> =>
  pedir(() => api.post<ResultadoCheckin>(`${RUTA}/checkin`, { qrToken }))

export const deHoy = (): Promise<AsistenciaConSocio[]> =>
  pedir(() => api.get<AsistenciaConSocio[]>(`${RUTA}/hoy`))
