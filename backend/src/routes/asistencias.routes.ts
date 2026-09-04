import { Router } from 'express';
import * as asistenciasController from '../controllers/asistencias.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { checkinSchema } from '../schemas/asistencias.schema';
import { asyncHandler } from '../utils/asyncHandler';

export const asistenciasRouter: Router = Router();

asistenciasRouter.use(authenticate);

asistenciasRouter.post(
  '/checkin',
  validate({ body: checkinSchema }),
  asyncHandler(asistenciasController.checkin),
);

asistenciasRouter.get('/hoy', asyncHandler(asistenciasController.deHoy));
