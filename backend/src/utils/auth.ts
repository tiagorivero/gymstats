import bcrypt from 'bcrypt';

const RONDAS_SALT = 10;

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, RONDAS_SALT);

export const verificarPassword = (plano: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plano, hash);
