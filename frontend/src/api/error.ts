import axios, { type AxiosResponse } from 'axios'

const MENSAJE_GENERICO = 'Algo salió mal. Probá de nuevo en un momento.'
const MENSAJE_SIN_RED = 'No pudimos conectar con el servidor. Revisá tu conexión.'

interface CuerpoDeError {
  error?: { codigo?: string; mensaje?: string }
}

const mensajeDe = (error: unknown): string => {
  if (!axios.isAxiosError<CuerpoDeError>(error)) return MENSAJE_GENERICO
  if (!error.response) return MENSAJE_SIN_RED
  return error.response.data?.error?.mensaje ?? MENSAJE_GENERICO
}

export const pedir = async <T>(operacion: () => Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const { data } = await operacion()
    return data
  } catch (error) {
    throw new Error(mensajeDe(error))
  }
}
