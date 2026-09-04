import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  endOfWeek,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const ZONA_HORARIA = 'America/Montevideo';

const OPCIONES_SEMANA = { weekStartsOn: 1 } as const;

export const ahora = (): Date => new Date();

// instante UTC -> horario en montevideo
const enZona = (instante: Date): Date => toZonedTime(instante, ZONA_HORARIA);
// instante montevideo -> instante UTC
const aUtc = (local: Date): Date => fromZonedTime(local, ZONA_HORARIA);

export const inicioDelDia = (instante: Date): Date => aUtc(startOfDay(enZona(instante)));
export const finDelDia = (instante: Date): Date => aUtc(endOfDay(enZona(instante)));

export const sumarDias = (instante: Date, dias: number): Date => aUtc(addDays(enZona(instante), dias));

export const diasEntre = (a: Date, b: Date): number =>
  differenceInCalendarDays(enZona(b), enZona(a));

export const hoy = (): Date => inicioDelDia(ahora());

export const inicioDeSemana = (): Date => aUtc(startOfWeek(enZona(ahora()), OPCIONES_SEMANA));
export const finDeSemana = (): Date => aUtc(endOfWeek(enZona(ahora()), OPCIONES_SEMANA));

// en Postgres se guarda solo el día calendario
export const soloFecha = (instante: Date): Date => {
  const local = enZona(instante);
  return new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()));
};

export const desdeFecha = (fecha: Date): Date =>
  aUtc(new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));

// pasa un string "YYYY-MM-DD" a un instante UTC
export const fechaCivil = (texto: string): Date => aUtc(parseISO(`${texto}T00:00:00`));
