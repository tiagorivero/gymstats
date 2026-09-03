// amplia Request con el usuario autenticado.
declare global {
  namespace Express {
    interface Request {
      usuario?: { id: string; nombre: string; email: string };
    }
  }
}

export { };
