export class AppError extends Error {
  readonly statusCode: number;
  readonly codigo: string;

  constructor(statusCode: number, codigo: string, mensaje: string) {
    super(mensaje);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.codigo = codigo;
    Error.captureStackTrace(this, AppError);
  }
}

//errores prehechos
export const malaSolicitud = (mensaje: string, codigo = 'MALA_SOLICITUD'): AppError =>
  new AppError(400, codigo, mensaje);

export const noAutorizado = (mensaje = 'No autorizado.', codigo = 'NO_AUTORIZADO'): AppError =>
  new AppError(401, codigo, mensaje);

export const prohibido = (mensaje = 'No tenés permiso para hacer esto.', codigo = 'PROHIBIDO'): AppError =>
  new AppError(403, codigo, mensaje);

export const noEncontrado = (mensaje = 'No se encontró el recurso.', codigo = 'NO_ENCONTRADO'): AppError =>
  new AppError(404, codigo, mensaje);

export const conflicto = (mensaje: string, codigo = 'CONFLICTO'): AppError =>
  new AppError(409, codigo, mensaje);
