export type EstadoSocio = 'ACTIVO' | 'INACTIVO'

export type EstadoMembresia = 'AL_DIA' | 'POR_VENCER' | 'VENCIDO' | 'SIN_PLAN'

export type EstadoCheckin = 'OK' | 'ADVERTENCIA' | 'RECHAZADO' | 'YA_REGISTRADO'

export interface Usuario {
  id: string
  nombre: string
  email: string
}

export interface Sesion {
  token: string
  usuario: Usuario
}

export interface Socio {
  id: string
  nombre: string
  apellido: string
  telefono: string | null
  email: string | null
  fotoUrl: string | null
  venceEl: string | null
  estado: EstadoSocio
  fechaAlta: string
  fechaBaja: string | null
  notas: string | null
  estadoMembresia: EstadoMembresia
  diasHastaVencimiento: number | null
}

export type SocioMini = Pick<Socio, 'id' | 'nombre' | 'apellido' | 'fotoUrl'>

export type SocioQueVence = Pick<Socio, 'id' | 'nombre' | 'apellido' | 'telefono' | 'venceEl'>

export type CrearSocio = Pick<Socio, 'nombre' | 'apellido'> &
  Partial<Pick<Socio, 'telefono' | 'email' | 'venceEl' | 'notas'>>

export type ActualizarSocio = Partial<CrearSocio>

export interface Asistencia {
  id: string
  fecha: string
  hora: string
}

export type AsistenciaConSocio = Asistencia & { socio: SocioMini }

export interface Paginado<T> {
  datos: T[]
  total: number
  pagina: number
  paginas: number
}

export type FiltroEstadoSocios = Exclude<EstadoMembresia, 'SIN_PLAN'> | 'INACTIVO'

export interface FiltrosSocios {
  q?: string
  estado?: FiltroEstadoSocios
  pagina?: number
  limite?: number
}

export interface FichaSocio {
  socio: Socio
  asistencias: Asistencia[]
  resumen: {
    asistenciasUltimos30: number
    diasDesdeUltimaVisita: number | null
  }
}

export interface ResumenMetricas {
  sociosActivos: number
  alDia: number
  porVencer: number
  vencidos: number
  totalSocios: number
  asistenciasHoy: number
  promedioDiario30: number
  venceEstaSemana: SocioQueVence[]
}

export interface ResultadoCheckin {
  resultado: EstadoCheckin
  motivo?: string
  socio: SocioMini
  membresia: {
    estado: EstadoMembresia
    venceEl: string | null
    diasRestantes: number | null
  }
  asistencia: Pick<Asistencia, 'hora'> | null
  asistenciasUltimos30: number
}
