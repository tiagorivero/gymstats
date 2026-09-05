import { useQuery } from '@tanstack/react-query'
import * as metricasApi from '@/api/metricas.api'
import type { ResumenMetricas } from '@/types'

export const metricasKeys = {
  todos: ['metricas'] as const,
  resumen: () => ['metricas', 'resumen'] as const,
}

export const useResumenMetricas = () =>
  useQuery<ResumenMetricas, Error>({
    queryKey: metricasKeys.resumen(),
    queryFn: metricasApi.resumen,
  })
