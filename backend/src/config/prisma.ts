import { PrismaClient } from '@prisma/client';
import { env } from './env';

const esDesarrollo = env.NODE_ENV === 'development';

// el singleton evita volverse a evaluar en cada guardado
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalParaPrisma.prisma ??
  new PrismaClient({
    log: esDesarrollo ? ['query', 'error'] : ['error'],
  });

if (esDesarrollo) {
  globalParaPrisma.prisma = prisma;
}
