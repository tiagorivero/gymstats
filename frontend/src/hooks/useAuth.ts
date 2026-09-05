import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as authApi from '@/api/auth.api'
import { borrarToken, guardarToken, leerToken } from '@/config/axios'
import type { Sesion, Usuario } from '@/types'

export const authKeys = {
  todos: ['auth'] as const,
  perfil: () => ['auth', 'perfil'] as const,
}

export const haySesion = (): boolean => Boolean(leerToken())

export const usePerfil = () =>
  useQuery<Usuario, Error>({
    queryKey: authKeys.perfil(),
    queryFn: authApi.perfil,
    enabled: haySesion(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation<Sesion, Error, authApi.Credenciales>({
    mutationFn: authApi.login,
    onSuccess: ({ token, usuario }) => {
      guardarToken(token)
      queryClient.setQueryData(authKeys.perfil(), usuario)
      toast.success(`Hola, ${usuario.nombre}`)
      navigate('/panel', { replace: true })
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    borrarToken()
    queryClient.clear()
    navigate('/login', { replace: true })
  }
}
