import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

//duck typing para saber si es un error de Prisma
interface ErrorPrismaConocido {
  name: string;
  code: string;
  meta?: { target?: unknown; modelName?: unknown };
}

const esErrorPrisma = (err: unknown): err is ErrorPrismaConocido =>
  typeof err === 'object' &&
  err !== null &&
  (err as { name?: unknown }).name === 'PrismaClientKnownRequestError' &&
  typeof (err as { code?: unknown }).code === 'string';

const camposDuplicados = (meta: ErrorPrismaConocido['meta']): string[] => {
  const target = meta?.target;
  if (Array.isArray(target)) return target.map(String);
  if (typeof target === 'string') return [target];
  return [];
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction,): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { codigo: err.codigo, mensaje: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        codigo: 'VALIDACION',
        mensaje: 'Los datos enviados no son válidos.',
        campos: err.issues.map((issue) => ({
          campo: issue.path.join('.') || '(raíz)',
          mensaje: issue.message,
        })),
      },
    });
    return;
  }

  if (esErrorPrisma(err)) {
    if (err.code === 'P2002') {
      const campos = camposDuplicados(err.meta);
      res.status(409).json({
        error: {
          codigo: 'REGISTRO_DUPLICADO',
          mensaje: campos.length
            ? `Ya existe un registro con ese valor en: ${campos.join(', ')}.`
            : 'Ya existe un registro con esos datos.',
          campos,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: { codigo: 'NO_ENCONTRADO', mensaje: 'No se encontró el recurso.' },
      });
      return;
    }
  }

  // error genérico
  console.error('[error no controlado]', err);
  res.status(500).json({
    error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrió un error interno. Intentá de nuevo.' },
  });
};
