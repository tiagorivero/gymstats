import type { Request, Response } from 'express';
import type {
  ActualizarSocioInput,
  CrearSocioInput,
  FiltrosSocios,
  SocioIdParams,
} from '../schemas/socios.schema';
import * as qrService from '../services/qr.service';
import * as sociosService from '../services/socios.service';

const idDe = (req: Request): string => (req.params as SocioIdParams).id;

export const listar = async (req: Request, res: Response): Promise<void> => {
  res.json(await sociosService.listar(req.query as unknown as FiltrosSocios));
};

export const obtener = async (req: Request, res: Response): Promise<void> => {
  res.json(await sociosService.obtener(idDe(req)));
};

export const crear = async (req: Request, res: Response): Promise<void> => {
  const socio = await sociosService.crear(req.body as CrearSocioInput);
  res.status(201).json(socio);
};

export const actualizar = async (req: Request, res: Response): Promise<void> => {
  res.json(await sociosService.actualizar(idDe(req), req.body as ActualizarSocioInput));
};

export const darDeBaja = async (req: Request, res: Response): Promise<void> => {
  res.json(await sociosService.darDeBaja(idDe(req)));
};

export const reactivar = async (req: Request, res: Response): Promise<void> => {
  res.json(await sociosService.reactivar(idDe(req)));
};

export const qr = async (req: Request, res: Response): Promise<void> => {
  res.json(await qrService.generarDeSocio(idDe(req)));
};
