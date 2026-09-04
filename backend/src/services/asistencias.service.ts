import { Prisma } from '@prisma/client';
import { EstadoSocio } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ahora, soloFecha, sumarDias } from '../utils/dates';
import { noEncontrado } from '../utils/errors';
import { resumenDe, type EstadoMembresia } from './membresia.service';

const DIAS_DE_RESUMEN = 30;

export type ResultadoCheckin = 'OK' | 'ADVERTENCIA' | 'RECHAZADO' | 'YA_REGISTRADO';

export interface RespuestaCheckin {
  resultado: ResultadoCheckin;
  motivo?: string;
  socio: { id: string; nombre: string; apellido: string; fotoUrl: string | null };
  membresia: { estado: EstadoMembresia; venceEl: Date | null; diasRestantes: number | null };
  asistencia: { hora: Date } | null;
  asistenciasUltimos30: number;
}

const SOCIO_EN_MOSTRADOR = {
  id: true,
  nombre: true,
  apellido: true,
  fotoUrl: true,
} satisfies Prisma.SocioSelect;

const MOTIVOS: Partial<Record<EstadoMembresia, string>> = {
  VENCIDO: 'La membresía está vencida.',
  SIN_PLAN: 'El socio no tiene un plan asignado.',
};

const esDuplicado = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

const contarUltimos30 = (socioId: string, momento: Date): Promise<number> =>
  prisma.asistencia.count({
    where: { socioId, fecha: { gte: soloFecha(sumarDias(momento, -(DIAS_DE_RESUMEN - 1))) } },
  });

interface Registro {
  resultado: ResultadoCheckin;
  motivo?: string;
  hora: Date;
}

// si el try catch falla es porque el socio ya se registro hoy
const registrar = async (
  socioId: string,
  momento: Date,
  estado: EstadoMembresia,
): Promise<Registro> => {
  const fecha = soloFecha(momento);
  try {
    await prisma.asistencia.create({ data: { socioId, fecha, hora: momento } });
  } catch (error) {
    if (!esDuplicado(error)) throw error;

    const previa = await prisma.asistencia.findUniqueOrThrow({
      where: { socioId_fecha: { socioId, fecha } },
      select: { hora: true },
    });
    return {
      resultado: 'YA_REGISTRADO',
      motivo: 'Ya había registrado la entrada hoy.',
      hora: previa.hora,
    };
  }

  const motivo = MOTIVOS[estado];
  if (motivo) return { resultado: 'ADVERTENCIA', motivo, hora: momento };
  return { resultado: 'OK', hora: momento };
};

export const registrarCheckin = async (qrToken: string): Promise<RespuestaCheckin> => {
  const socio = await prisma.socio.findUnique({
    where: { qrToken },
    select: { ...SOCIO_EN_MOSTRADOR, estado: true, venceEl: true },
  });
  if (!socio) throw noEncontrado('Ese código QR no corresponde a ningún socio.', 'QR_INVALIDO');

  const momento = ahora();
  const { id, nombre, apellido, fotoUrl, estado, venceEl } = socio;
  const membresia = resumenDe(venceEl, momento);

  const registro =
    estado === EstadoSocio.INACTIVO
      ? null
      : await registrar(id, momento, membresia.estado);

  return {
    resultado: registro?.resultado ?? 'RECHAZADO',
    ...(registro ? { motivo: registro.motivo } : { motivo: 'Socio dado de baja' }),
    socio: { id, nombre, apellido, fotoUrl },
    membresia: {
      estado: membresia.estado,
      venceEl,
      diasRestantes: membresia.diasHastaVencimiento,
    },
    asistencia: registro ? { hora: registro.hora } : null,
    asistenciasUltimos30: await contarUltimos30(id, momento),
  };
};

export const listarDeHoy = () =>
  prisma.asistencia.findMany({
    where: { fecha: soloFecha(ahora()) },
    orderBy: { hora: 'desc' },
    select: { id: true, fecha: true, hora: true, socio: { select: SOCIO_EN_MOSTRADOR } },
  });
