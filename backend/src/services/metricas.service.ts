import { EstadoSocio } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ahora, finDeSemana, inicioDeSemana, soloFecha, sumarDias } from '../utils/dates';
import { limitesDe } from './membresia.service';

const DIAS_DE_PROMEDIO = 30;

export const resumen = async () => {
  const momento = ahora();
  const { vencidoAntesDe, porVencerHasta } = limitesDe(momento);
  const activo = { estado: EstadoSocio.ACTIVO };

  const [totalSocios, sociosActivos, alDia, porVencer, vencidos, asistenciasHoy, asistenciasDelPeriodo, venceEstaSemana,
  ] = await Promise.all([
    prisma.socio.count(),
    prisma.socio.count({ where: activo }),
    prisma.socio.count({ where: { ...activo, venceEl: { gt: porVencerHasta } } }),
    prisma.socio.count({
      where: { ...activo, venceEl: { gte: vencidoAntesDe, lte: porVencerHasta } },
    }),
    prisma.socio.count({ where: { ...activo, venceEl: { lt: vencidoAntesDe } } }),
    prisma.asistencia.count({ where: { fecha: soloFecha(momento) } }),
    prisma.asistencia.count({
      where: { fecha: { gte: soloFecha(sumarDias(momento, -(DIAS_DE_PROMEDIO - 1))) } },
    }),
    prisma.socio.findMany({
      where: { ...activo, venceEl: { gte: inicioDeSemana(), lte: finDeSemana() } },
      orderBy: [{ venceEl: 'asc' }, { apellido: 'asc' }],
      select: { id: true, nombre: true, apellido: true, telefono: true, venceEl: true },
    }),
  ]);

  return {
    sociosActivos,
    alDia,
    porVencer,
    vencidos,
    totalSocios,
    asistenciasHoy,
    promedioDiario30: Math.round((asistenciasDelPeriodo / DIAS_DE_PROMEDIO) * 10) / 10,
    venceEstaSemana,
  };
};
