import { Router } from 'express';
import * as sociosController from '../controllers/socios.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  actualizarSocioSchema,
  crearSocioSchema,
  filtrosSociosSchema,
  socioIdSchema,
} from '../schemas/socios.schema';
import { asyncHandler } from '../utils/asyncHandler';

export const sociosRouter: Router = Router();

sociosRouter.use(authenticate);

sociosRouter.get(
  '/',
  validate({ query: filtrosSociosSchema }),
  asyncHandler(sociosController.listar),
);

sociosRouter.post(
  '/',
  validate({ body: crearSocioSchema }),
  asyncHandler(sociosController.crear),
);

sociosRouter.get(
  '/:id',
  validate({ params: socioIdSchema }),
  asyncHandler(sociosController.obtener),
);

sociosRouter.patch(
  '/:id',
  validate({ params: socioIdSchema, body: actualizarSocioSchema }),
  asyncHandler(sociosController.actualizar),
);

sociosRouter.post(
  '/:id/baja',
  validate({ params: socioIdSchema }),
  asyncHandler(sociosController.darDeBaja),
);

sociosRouter.post(
  '/:id/reactivar',
  validate({ params: socioIdSchema }),
  asyncHandler(sociosController.reactivar),
);

sociosRouter.get(
  '/:id/qr',
  validate({ params: socioIdSchema }),
  asyncHandler(sociosController.qr),
);
