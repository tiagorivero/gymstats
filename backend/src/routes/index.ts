import { Router } from 'express';
import { authRouter } from './auth.routes';

export const router: Router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
