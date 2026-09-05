import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as sociosApi from '@/api/socios.api'
import type { ActualizarSocio, CrearSocio, FichaSocio, FiltrosSocios, Paginado, Socio } from '@/types'
import { metricasKeys } from './useMetricas'

export const sociosKeys = {
  todos: ['socios'] as const,
  lista: (filtros: FiltrosSocios) => ['socios', 'lista', filtros] as const,
  detalle: (id: string) => ['socios', 'detalle', id] as const,
  qr: (id: string) => ['socios', 'qr', id] as const,
}

const refrescarTodo = (queryClient: QueryClient, id?: string): void => {
  void queryClient.invalidateQueries({ queryKey: sociosKeys.todos })
  void queryClient.invalidateQueries({ queryKey: metricasKeys.todos })
  if (id) void queryClient.invalidateQueries({ queryKey: sociosKeys.detalle(id) })
}

export const useSocios = (filtros: FiltrosSocios = {}) =>
  useQuery<Paginado<Socio>, Error>({
    queryKey: sociosKeys.lista(filtros),
    queryFn: () => sociosApi.listar(filtros),
  })

export const useSocio = (id: string) =>
  useQuery<FichaSocio, Error>({
    queryKey: sociosKeys.detalle(id),
    queryFn: () => sociosApi.obtener(id),
    enabled: Boolean(id),
  })

export const useQrSocio = (id: string, habilitado = true) =>
  useQuery<string, Error>({
    queryKey: sociosKeys.qr(id),
    queryFn: () => sociosApi.qr(id),
    enabled: Boolean(id) && habilitado,
    staleTime: Infinity,
  })

export const useCrearSocio = () => {
  const queryClient = useQueryClient()

  return useMutation<Socio, Error, CrearSocio>({
    mutationFn: sociosApi.crear,
    onSuccess: (socio) => {
      refrescarTodo(queryClient)
      toast.success(`${socio.nombre} ${socio.apellido} quedó registrado.`)
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useActualizarSocio = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation<Socio, Error, ActualizarSocio>({
    mutationFn: (datos) => sociosApi.actualizar(id, datos),
    onSuccess: () => {
      refrescarTodo(queryClient, id)
      toast.success('Guardamos los cambios.')
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useDarDeBajaSocio = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation<Socio, Error, void>({
    mutationFn: () => sociosApi.darDeBaja(id),
    onSuccess: () => {
      refrescarTodo(queryClient, id)
      toast.success('El socio quedó dado de baja.')
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useReactivarSocio = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation<Socio, Error, void>({
    mutationFn: () => sociosApi.reactivar(id),
    onSuccess: () => {
      refrescarTodo(queryClient, id)
      toast.success('El socio volvió a estar activo.')
    },
    onError: (error) => toast.error(error.message),
  })
}
