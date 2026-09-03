// prisma trabaja con UTC, usamos el offset
const OFFSET_MONTEVIDEO_MS = -3 * 60 * 60 * 1000;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function diaDe(instante: Date): Date {
  const local = new Date(instante.getTime() + OFFSET_MONTEVIDEO_MS);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()));
}

export function diaDeHoy(): Date {
  return diaDe(new Date());
}

export function sumarDias(dia: Date, dias: number): Date {
  return new Date(dia.getTime() + dias * MS_POR_DIA);
}

export function instanteLocal(dia: Date, hora: number, minuto: number): Date {
  return new Date(dia.getTime() - OFFSET_MONTEVIDEO_MS + (hora * 60 + minuto) * 60 * 1000);
}

export function finDelDiaLocal(dia: Date): Date {
  return instanteLocal(dia, 23, 59);
}

export function diaDeLaSemana(dia: Date): number {
  return dia.getUTCDay();
}
