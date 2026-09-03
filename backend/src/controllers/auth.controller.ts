import type { Request, Response } from 'express';
import type { LoginInput } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;
  const resultado = await authService.login(email, password);
  res.json(resultado);
};

export const perfil = (req: Request, res: Response): void => {
  res.json({ usuario: req.usuario });
};
