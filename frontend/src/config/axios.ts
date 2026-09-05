import axios from 'axios'

export const CLAVE_TOKEN = 'GYMSTATS_TOKEN'

const RUTA_LOGIN = '/login'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const leerToken = (): string | null => localStorage.getItem(CLAVE_TOKEN)
export const guardarToken = (token: string): void => localStorage.setItem(CLAVE_TOKEN, token)
export const borrarToken = (): void => localStorage.removeItem(CLAVE_TOKEN)

api.interceptors.request.use((config) => {
  const token = leerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const esIntentoDeLogin = (url: string | undefined): boolean => Boolean(url?.includes('/auth/login'))

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (!esIntentoDeLogin(error.config?.url)) {
        borrarToken()
        if (window.location.pathname !== RUTA_LOGIN) window.location.assign(RUTA_LOGIN)
      }
    }
    return Promise.reject(error)
  },
)
