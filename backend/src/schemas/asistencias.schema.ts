import { z } from 'zod';

export const checkinSchema = z.object({
  // se valida la forma, no si el qr es valido
  qrToken: z
    .string('Escaneá el código QR del socio.')
    .trim()
    .min(1, 'Escaneá el código QR del socio.')
    .max(200),
});

export type CheckinInput = z.infer<typeof checkinSchema>;
