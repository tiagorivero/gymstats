import { z } from 'zod';

export const LIMITE_POR_DEFECTO = 20;
export const LIMITE_MAXIMO = 100;

// null refiere a borrar el dato y undefined a no enviar el dato, desde el PATCH
const texto = (max: number, mensaje: string) =>
  z.string().trim().min(1, mensaje).max(max, `Máximo ${max} caracteres.`).nullable().optional();

export const socioIdSchema = z.object({
  id: z.uuid('El identificador del socio no es válido.'),
});

export const filtrosSociosSchema = z.object({
  q: z.string('La búsqueda tiene que ser texto.').trim().min(1).max(60).optional(),
  estado: z
    .enum(['AL_DIA', 'POR_VENCER', 'VENCIDO', 'INACTIVO'], {
      message: 'El estado tiene que ser AL_DIA, POR_VENCER, VENCIDO o INACTIVO.',
    })
    .optional(),
  pagina: z.coerce
    .number('La página tiene que ser un número.')
    .int()
    .min(1, 'La página arranca en 1.')
    .default(1),
  limite: z.coerce
    .number('El límite tiene que ser un número.')
    .int()
    .min(1, 'Pedí al menos un resultado.')
    .max(LIMITE_MAXIMO, `Como máximo ${LIMITE_MAXIMO} resultados por página.`)
    .default(LIMITE_POR_DEFECTO),
});

export const crearSocioSchema = z.object({
  nombre: z
    .string('Ingresá el nombre.')
    .trim()
    .min(2, 'El nombre necesita al menos 2 caracteres.')
    .max(60, 'Máximo 60 caracteres.'),
  apellido: z
    .string('Ingresá el apellido.')
    .trim()
    .min(2, 'El apellido necesita al menos 2 caracteres.')
    .max(60, 'Máximo 60 caracteres.'),
  telefono: texto(20, 'Ingresá un teléfono válido.'),
  email: z.email('Ingresá un email válido.').nullable().optional(),
  // fecha civil (YYYY-MM-DD) 
  venceEl: z.iso.date('Usá el formato AAAA-MM-DD.').nullable().optional(),
  notas: texto(1000, 'Las notas no pueden quedar vacías.'),
});

export const actualizarSocioSchema = crearSocioSchema.partial();

export type FiltrosSocios = z.infer<typeof filtrosSociosSchema>;
export type CrearSocioInput = z.infer<typeof crearSocioSchema>;
export type ActualizarSocioInput = z.infer<typeof actualizarSocioSchema>;
export type SocioIdParams = z.infer<typeof socioIdSchema>;
