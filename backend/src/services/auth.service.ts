import { prisma } from '../config/prisma';
import { verificarPassword } from '../utils/auth';
import { noAutorizado } from '../utils/errors';
import { firmarToken } from '../utils/jwt';

interface UsuarioPublico {
  id: string;
  nombre: string;
  email: string;
}

interface ResultadoLogin {
  token: string;
  usuario: UsuarioPublico;
}

// para que el tiempo de respuesta sea el mismo si existe o no el email, por seguridad
const HASH_SEÑUELO = '$2b$10$w99qymHCbbGDtcAVyphXBelveXvP7OVxHhrfJzsWHT0lWhbSlh3iq';

export const login = async (email: string, password: string): Promise<ResultadoLogin> => {
  const credencialesInvalidas = noAutorizado(
    'Email o contraseña incorrectos',
    'CREDENCIALES_INVALIDAS',
  );

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  const passwordOk = await verificarPassword(password, usuario?.password ?? HASH_SEÑUELO);
  if (!usuario || !usuario.activo || !passwordOk) {
    throw credencialesInvalidas;
  }

  const token = firmarToken({ id: usuario.id });
  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  };
};
