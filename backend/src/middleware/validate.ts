import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

interface SchemasValidacion {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

type ParteRequest = 'body' | 'params' | 'query';

// parsea los datos del request y los convierte a los tipos correctos
const reemplazar = (req: Request, parte: ParteRequest, valor: unknown): void => {
  Object.defineProperty(req, parte, {
    value: valor,
    writable: true,
    enumerable: true,
    configurable: true,
  });
};

export const validate = (schemas: SchemasValidacion): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) reemplazar(req, 'body', schemas.body.parse(req.body));
      if (schemas.params) reemplazar(req, 'params', schemas.params.parse(req.params));
      if (schemas.query) reemplazar(req, 'query', schemas.query.parse(req.query));
      next();
    } catch (err) {
      next(err);
    }
  };
