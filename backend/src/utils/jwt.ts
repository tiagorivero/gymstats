import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface PayloadToken {
  id: string;
}

export const firmarToken = (payload: PayloadToken): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

// devuelve el payload si el token es válido
export const verificarToken = (token: string): PayloadToken | null => {
  try {
    const decodificado = jwt.verify(token, env.JWT_SECRET);
    if (typeof decodificado === 'string' || typeof decodificado.id !== 'string') {
      return null;
    }
    return { id: decodificado.id };
  } catch {
    return null;
  }
};
