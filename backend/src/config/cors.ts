import type { CorsOptions } from 'cors';
import { env } from './env';
import { prohibido } from '../utils/errors';

const whitelist = [env.FRONTEND_URL];

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // se habilita para poder testear la api con Thunder Client
    if (origin === undefined) {
      if (env.NODE_ENV === 'development') return callback(null, true);
      return callback(prohibido('Origen no permitido por CORS.', 'CORS_ORIGEN_NO_PERMITIDO'));
    }

    if (whitelist.includes(origin)) return callback(null, true);

    return callback(prohibido('Origen no permitido por CORS.', 'CORS_ORIGEN_NO_PERMITIDO'));
  },
  credentials: true,
};
