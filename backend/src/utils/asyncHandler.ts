import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ControllerAsync = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// resuelve si express no detecta errores dentro de funciones async
export const asyncHandler = (fn: ControllerAsync): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
