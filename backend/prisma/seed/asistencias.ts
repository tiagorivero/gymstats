import { fakerES as faker } from '@faker-js/faker';
import { EstadoSocio } from '@prisma/client';
import {
  agruparPorSemana,
  crearAsistencia,
  diasHabilitados,
  elegirDias,
  type AsistenciaSemilla,
} from './agenda';
import { diaDe, sumarDias } from './fechas';
import type { SocioSemilla } from './socios';

export type { AsistenciaSemilla };

const DIAS_SIN_VENIR = 20;
const SOCIOS_EN_RIESGO = 8;

const ANTIGUEDAD_MINIMA_EN_RIESGO = 45;
const VISITAS_PREVIAS_MINIMAS = 2;

const FRECUENCIAS_SEMANALES = [2, 2, 2, 2, 2, 3, 3, 3, 4, 5];

const PROBABILIDAD_SEMANA_ACTIVA = 0.68;

function tieneCuotaVigente(socio: SocioSemilla, hoy: Date): boolean {
  return socio.venceEl !== null && socio.venceEl >= hoy;
}

function elegirSociosEnRiesgo(activos: SocioSemilla[], hoy: Date): Set<string> {
  const candidatos = activos.filter(
    (socio) =>
      tieneCuotaVigente(socio, hoy) &&
      diaDe(socio.fechaAlta) <= sumarDias(hoy, -ANTIGUEDAD_MINIMA_EN_RIESGO),
  );

  return new Set(
    faker.helpers.shuffle(candidatos).slice(0, SOCIOS_EN_RIESGO).map((socio) => socio.id),
  );
}

function agregarVisita(
  socio: SocioSemilla,
  hoy: Date,
  usados: Set<number>,
  asistencias: AsistenciaSemilla[],
  entra: (offset: number) => boolean,
): boolean {
  const candidatos = diasHabilitados(socio, hoy, 0).filter(
    (offset) => entra(offset) && !usados.has(offset),
  );
  if (candidatos.length === 0) return false;

  const offset = faker.helpers.arrayElement(candidatos);
  usados.add(offset);
  asistencias.push(crearAsistencia(socio.id, hoy, offset));
  return true;
}

function asegurarHistorialPrevio(
  socio: SocioSemilla,
  hoy: Date,
  usados: Set<number>,
  asistencias: AsistenciaSemilla[],
): void {
  while (usados.size < VISITAS_PREVIAS_MINIMAS) {
    if (!agregarVisita(socio, hoy, usados, asistencias, (offset) => offset < -DIAS_SIN_VENIR)) return;
  }
}

function asegurarActividadReciente(
  socio: SocioSemilla,
  hoy: Date,
  usados: Set<number>,
  asistencias: AsistenciaSemilla[],
): void {
  if ([...usados].some((offset) => offset > -DIAS_SIN_VENIR)) return;
  agregarVisita(socio, hoy, usados, asistencias, (offset) => offset > -DIAS_SIN_VENIR);
}

export function generarAsistencias(socios: SocioSemilla[], hoy: Date): AsistenciaSemilla[] {
  const activos = socios.filter((socio) => socio.estado === EstadoSocio.ACTIVO);
  const enRiesgo = elegirSociosEnRiesgo(activos, hoy);
  const asistencias: AsistenciaSemilla[] = [];

  for (const socio of activos) {
    const frecuencia = faker.helpers.arrayElement(FRECUENCIAS_SEMANALES);
    const estaEnRiesgo = enRiesgo.has(socio.id);
    const offsetMaximo = estaEnRiesgo ? -DIAS_SIN_VENIR - 1 : 0;
    const usados = new Set<number>();

    for (const semana of agruparPorSemana(diasHabilitados(socio, hoy, offsetMaximo))) {
      if (!faker.datatype.boolean(PROBABILIDAD_SEMANA_ACTIVA)) continue;

      for (const offset of elegirDias(semana, hoy, Math.min(frecuencia, semana.length))) {
        usados.add(offset);
        asistencias.push(crearAsistencia(socio.id, hoy, offset));
      }
    }

    if (estaEnRiesgo) asegurarHistorialPrevio(socio, hoy, usados, asistencias);
    else if (tieneCuotaVigente(socio, hoy)) asegurarActividadReciente(socio, hoy, usados, asistencias);
  }

  return asistencias.sort((a, b) => a.hora.getTime() - b.hora.getTime());
}
