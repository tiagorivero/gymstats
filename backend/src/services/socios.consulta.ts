import { EstadoSocio, type Prisma } from '@prisma/client';
import type { FiltrosSocios } from '../schemas/socios.schema';
import { limitesDe, resumenDe, type ResumenMembresia } from './membresia.service';

// el qrToken no viaja en las respuestas de socios ya que es un dato sensible y privado
export const CAMPOS = {
  id: true,
  nombre: true,
  apellido: true,
  telefono: true,
  email: true,
  fotoUrl: true,
  venceEl: true,
  estado: true,
  fechaAlta: true,
  fechaBaja: true,
  notas: true,
} satisfies Prisma.SocioSelect;

export type SocioPublico = Prisma.SocioGetPayload<{ select: typeof CAMPOS }>;

export type SocioConMembresia = SocioPublico & {
  estadoMembresia: ResumenMembresia['estado'];
  diasHastaVencimiento: number | null;
};

export const conMembresia = (socio: SocioPublico, momento: Date): SocioConMembresia => {
  const { estado, diasHastaVencimiento } = resumenDe(socio.venceEl, momento);
  return { ...socio, estadoMembresia: estado, diasHastaVencimiento };
};

export const filtroBusqueda = (q: string | undefined): Prisma.SocioWhereInput => {
  if (!q) return {};
  const contiene = { contains: q, mode: 'insensitive' } as const;
  return { OR: [{ nombre: contiene }, { apellido: contiene }, { telefono: contiene }] };
};

// traduce el estado a sql
export const filtroEstado = (
  estado: FiltrosSocios['estado'],
  momento: Date,
): Prisma.SocioWhereInput => {
  if (!estado) return {};
  if (estado === 'INACTIVO') return { estado: EstadoSocio.INACTIVO };

  const { vencidoAntesDe, porVencerHasta } = limitesDe(momento);
  const activo = { estado: EstadoSocio.ACTIVO };
  if (estado === 'VENCIDO') return { ...activo, venceEl: { lt: vencidoAntesDe } };
  if (estado === 'POR_VENCER') {
    return { ...activo, venceEl: { gte: vencidoAntesDe, lte: porVencerHasta } };
  }
  return { ...activo, venceEl: { gt: porVencerHasta } };
};
