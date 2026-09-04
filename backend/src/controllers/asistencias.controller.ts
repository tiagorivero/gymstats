import type { Request, Response } from 'express';
import type { CheckinInput } from '../schemas/asistencias.schema';
import * as asistenciasService from '../services/asistencias.service';

export const checkin = async (req: Request, res: Response): Promise<void> => {
  const { qrToken } = req.body as CheckinInput;
  res.json(await asistenciasService.registrarCheckin(qrToken));
};

export const deHoy = async (_req: Request, res: Response): Promise<void> => {
  res.json(await asistenciasService.listarDeHoy());
};
