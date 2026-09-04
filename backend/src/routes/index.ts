import { Router } from 'express';
import { asistenciasRouter } from './asistencias.routes';
import { authRouter } from './auth.routes';
import { metricasRouter } from './metricas.routes';
import { sociosRouter } from './socios.routes';

export const router: Router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
router.use('/socios', sociosRouter);
router.use('/asistencias', asistenciasRouter);
router.use('/metricas', metricasRouter);
