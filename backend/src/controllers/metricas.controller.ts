import type { Request, Response } from 'express';
import * as metricasService from '../services/metricas.service';

export const resumen = async (_req: Request, res: Response): Promise<void> => {
  res.json(await metricasService.resumen());
};
