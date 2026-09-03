import { prisma } from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { noAutorizado } from '../utils/errors';
import { verificarToken } from '../utils/jwt';

const PREFIJO_BEARER = 'Bearer ';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(PREFIJO_BEARER)) {
    throw noAutorizado('Necesitás iniciar sesión.');
  }

  const token = header.slice(PREFIJO_BEARER.length).trim();
  const payload = verificarToken(token);
  if (!payload) {
    throw noAutorizado('La sesión expiró o el token es inválido.');
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
  if (!usuario || !usuario.activo) {
    throw noAutorizado('Necesitás iniciar sesión.');
  }

  req.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
  next();
});
