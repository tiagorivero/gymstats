import { api } from '@/config/axios'
import type { Sesion, Usuario } from '@/types'
import { pedir } from './error'

const RUTA = '/api/auth'

export interface Credenciales {
  email: string
  password: string
}

export const login = (credenciales: Credenciales): Promise<Sesion> =>
  pedir(() => api.post<Sesion>(`${RUTA}/login`, credenciales))

export const perfil = async (): Promise<Usuario> => {
  const { usuario } = await pedir(() => api.get<{ usuario: Usuario }>(`${RUTA}/perfil`))
  return usuario
}
