import { api } from '@/config/axios'
import type { ResumenMetricas } from '@/types'
import { pedir } from './error'

const RUTA = '/api/metricas'

export const resumen = (): Promise<ResumenMetricas> =>
  pedir(() => api.get<ResumenMetricas>(`${RUTA}/resumen`))
