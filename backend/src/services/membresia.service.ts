import { ahora, diasEntre, finDelDia, inicioDelDia, sumarDias } from '../utils/dates';

export type EstadoMembresia = 'AL_DIA' | 'POR_VENCER' | 'VENCIDO' | 'SIN_PLAN';
export const DIAS_DE_AVISO = 7;

export interface LimitesMembresia {
  vencidoAntesDe: Date;
  porVencerHasta: Date;
}

export interface ResumenMembresia {
  estado: EstadoMembresia;
  diasHastaVencimiento: number | null;
}

export const limitesDe = (hoy: Date = ahora()): LimitesMembresia => ({
  vencidoAntesDe: inicioDelDia(hoy),
  porVencerHasta: finDelDia(sumarDias(hoy, DIAS_DE_AVISO)),
});

export const calcularEstado = (venceEl: Date | null, hoy: Date = ahora()): EstadoMembresia => {
  if (venceEl === null) return 'SIN_PLAN';

  const { vencidoAntesDe, porVencerHasta } = limitesDe(hoy);
  if (venceEl < vencidoAntesDe) return 'VENCIDO';
  if (venceEl <= porVencerHasta) return 'POR_VENCER';
  return 'AL_DIA';
};

export const diasHastaVencimiento = (venceEl: Date, hoy: Date = ahora()): number =>
  diasEntre(hoy, venceEl);

export const resumenDe = (venceEl: Date | null, hoy: Date = ahora()): ResumenMembresia => ({
  estado: calcularEstado(venceEl, hoy),
  diasHastaVencimiento: venceEl === null ? null : diasHastaVencimiento(venceEl, hoy),
});
