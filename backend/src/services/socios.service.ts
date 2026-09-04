import { randomUUID } from 'node:crypto';
import { EstadoSocio, type Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { ActualizarSocioInput, CrearSocioInput, FiltrosSocios } from '../schemas/socios.schema';
import { ahora, desdeFecha, diasEntre, fechaCivil, finDelDia, soloFecha, sumarDias, } from '../utils/dates';
import { conflicto, noEncontrado } from '../utils/errors';
import { CAMPOS, conMembresia, filtroBusqueda, filtroEstado, type SocioConMembresia, } from './socios.consulta';

const DIAS_DE_RESUMEN = 30;
const ASISTENCIAS_EN_FICHA = 20;

const NO_ENCONTRADO = 'No encontramos a ese socio.';

export const listar = async ({ q, estado, pagina, limite }: FiltrosSocios) => {
  const momento = ahora();
  const where: Prisma.SocioWhereInput = {
    AND: [filtroBusqueda(q), filtroEstado(estado, momento)],
  };

  const [socios, total] = await Promise.all([
    prisma.socio.findMany({
      where,
      select: CAMPOS,
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.socio.count({ where }),
  ]);

  return {
    datos: socios.map((socio) => conMembresia(socio, momento)),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / limite)),
  };
};

export const obtener = async (id: string) => {
  const momento = ahora();
  const desde = soloFecha(sumarDias(momento, -(DIAS_DE_RESUMEN - 1)));

  const socio = await prisma.socio.findUnique({ where: { id }, select: CAMPOS });
  if (!socio) throw noEncontrado(NO_ENCONTRADO);

  const [asistencias, asistenciasUltimos30] = await Promise.all([
    prisma.asistencia.findMany({
      where: { socioId: id },
      orderBy: { fecha: 'desc' },
      take: ASISTENCIAS_EN_FICHA,
      select: { id: true, fecha: true, hora: true },
    }),
    prisma.asistencia.count({ where: { socioId: id, fecha: { gte: desde } } }),
  ]);

  const ultima = asistencias[0];
  return {
    socio: conMembresia(socio, momento),
    asistencias,
    resumen: {
      asistenciasUltimos30,
      diasDesdeUltimaVisita: ultima ? diasEntre(desdeFecha(ultima.fecha), momento) : null,
    },
  };
};

const vencimiento = (venceEl: string | null | undefined): Date | null | undefined =>
  typeof venceEl === 'string' ? finDelDia(fechaCivil(venceEl)) : venceEl;

export const crear = async (datos: CrearSocioInput): Promise<SocioConMembresia> => {
  const socio = await prisma.socio.create({
    data: { ...datos, venceEl: vencimiento(datos.venceEl), qrToken: randomUUID() },
    select: CAMPOS,
  });
  return conMembresia(socio, ahora());
};

export const actualizar = async (
  id: string,
  datos: ActualizarSocioInput,
): Promise<SocioConMembresia> => {
  const socio = await prisma.socio.update({
    where: { id },
    data: { ...datos, venceEl: vencimiento(datos.venceEl) },
    select: CAMPOS,
  });
  return conMembresia(socio, ahora());
};

// el cambio de estado depende del estado previo
const cambiarEstado = async (
  id: string,
  desde: EstadoSocio,
  data: Prisma.SocioUpdateInput,
  mensajeConflicto: string,
): Promise<SocioConMembresia> => {
  const { count } = await prisma.socio.updateMany({ where: { id, estado: desde }, data });
  if (count === 0) {
    const existe = await prisma.socio.count({ where: { id } });
    throw existe ? conflicto(mensajeConflicto) : noEncontrado(NO_ENCONTRADO);
  }

  const socio = await prisma.socio.findUniqueOrThrow({ where: { id }, select: CAMPOS });
  return conMembresia(socio, ahora());
};

export const darDeBaja = (id: string): Promise<SocioConMembresia> =>
  cambiarEstado(
    id,
    EstadoSocio.ACTIVO,
    { estado: EstadoSocio.INACTIVO, fechaBaja: ahora() },
    'El socio ya estaba dado de baja.',
  );

export const reactivar = (id: string): Promise<SocioConMembresia> =>
  cambiarEstado(
    id,
    EstadoSocio.INACTIVO,
    { estado: EstadoSocio.ACTIVO, fechaBaja: null },
    'El socio ya estaba activo.',
  );
