import { Router } from 'express';
import * as metricasController from '../controllers/metricas.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const metricasRouter: Router = Router();

metricasRouter.use(authenticate);

metricasRouter.get('/resumen', asyncHandler(metricasController.resumen));
