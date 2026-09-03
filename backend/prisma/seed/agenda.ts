import { randomUUID } from 'node:crypto';
import { fakerES as faker } from '@faker-js/faker';
import { diaDe, diaDeLaSemana, instanteLocal, sumarDias } from './fechas';
import type { SocioSemilla } from './socios';

export interface AsistenciaSemilla {
  id: string;
  socioId: string;
  fecha: Date;
  hora: Date;
}

export const DIAS_DE_VENTANA = 60;

const PESO_SABADO = 0.35;
const DOMINGO = 0;
const SABADO = 6;

const PESOS_POR_HORA = [
  { value: 7, weight: 7 },
  { value: 8, weight: 9 },
  { value: 9, weight: 6 },
  { value: 10, weight: 3 },
  { value: 11, weight: 3 },
  { value: 12, weight: 1 },
  { value: 13, weight: 1 },
  { value: 14, weight: 2 },
  { value: 15, weight: 3 },
  { value: 16, weight: 3 },
  { value: 17, weight: 5 },
  { value: 18, weight: 18 },
  { value: 19, weight: 22 },
  { value: 20, weight: 17 },
];

export function diasHabilitados(socio: SocioSemilla, hoy: Date, offsetMaximo: number): number[] {
  const desde = diaDe(socio.fechaAlta);
  const hasta = socio.venceEl === null ? null : diaDe(socio.venceEl);
  const offsets: number[] = [];

  for (let offset = -DIAS_DE_VENTANA; offset <= offsetMaximo; offset += 1) {
    const dia = sumarDias(hoy, offset);
    if (diaDeLaSemana(dia) === DOMINGO) continue;
    if (dia < desde) continue;
    if (hasta !== null && dia > hasta) continue;
    offsets.push(offset);
  }

  return offsets;
}

export function agruparPorSemana(offsets: number[]): number[][] {
  const semanas = new Map<number, number[]>();

  for (const offset of offsets) {
    const semana = Math.floor((offset + DIAS_DE_VENTANA) / 7);
    const dias = semanas.get(semana);
    if (dias === undefined) semanas.set(semana, [offset]);
    else dias.push(offset);
  }

  return [...semanas.values()];
}

export function elegirDias(candidatos: number[], hoy: Date, cantidad: number): number[] {
  const restantes = [...candidatos];
  const elegidos: number[] = [];

  while (elegidos.length < cantidad && restantes.length > 0) {
    const pesos = restantes.map((offset) =>
      diaDeLaSemana(sumarDias(hoy, offset)) === SABADO ? PESO_SABADO : 1,
    );
    let sorteo = faker.number.float({ min: 0, max: pesos.reduce((suma, peso) => suma + peso, 0) });

    let i = 0;
    while (i < restantes.length - 1 && sorteo > pesos[i]) {
      sorteo -= pesos[i];
      i += 1;
    }

    elegidos.push(restantes[i]);
    restantes.splice(i, 1);
  }

  return elegidos;
}

export function crearAsistencia(socioId: string, hoy: Date, offset: number): AsistenciaSemilla {
  const fecha = sumarDias(hoy, offset);
  const hora = faker.helpers.weightedArrayElement(PESOS_POR_HORA);

  return {
    id: randomUUID(),
    socioId,
    fecha,
    hora: instanteLocal(fecha, hora, faker.number.int({ min: 0, max: 59 })),
  };
}
