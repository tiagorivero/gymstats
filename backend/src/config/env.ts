import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.url({ message: 'Debe ser una URL válida (ej: http://localhost:5173)' }),
  DATABASE_URL: z.string().min(1, 'Requerida: conexión al pooler de Postgres (puerto 6543).'),
  DIRECT_URL: z.string().min(1, 'Requerida: conexión directa a Postgres (puerto 5432).'),
});

const resultado = envSchema.safeParse(process.env);

if (!resultado.success) {
  console.error('Faltan variables de entorno o son inválidas:');
  for (const issue of resultado.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = resultado.data;

export type Env = typeof env;
