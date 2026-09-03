import { Router } from 'express';
import { login, perfil } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../utils/asyncHandler';

export const authRouter: Router = Router();

authRouter.post('/login', validate({ body: loginSchema }), asyncHandler(login));
authRouter.get('/perfil', authenticate, perfil);
