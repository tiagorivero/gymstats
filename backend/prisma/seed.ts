import bcrypt from 'bcrypt';
import { prisma } from '../src/config/prisma';
import { generarAsistencias } from './seed/asistencias';
import { diaDeHoy } from './seed/fechas';
import { generarSocios } from './seed/socios';

const RONDAS_BCRYPT = 10;

const USUARIO_DEMO = {
  nombre: 'Demo',
  email: 'demo@gymstats.com',
  password: 'demo1234',
} as const;

async function main(): Promise<void> {
  //se borra en orden inverso por las dependencias y se vuelve a insertar
  await prisma.asistencia.deleteMany();
  await prisma.socio.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.create({
    data: {
      nombre: USUARIO_DEMO.nombre,
      email: USUARIO_DEMO.email,
      password: await bcrypt.hash(USUARIO_DEMO.password, RONDAS_BCRYPT),
    },
  });

  const hoy = diaDeHoy();
  const socios = generarSocios(hoy);
  await prisma.socio.createMany({ data: socios });

  const asistencias = generarAsistencias(socios, hoy);
  await prisma.asistencia.createMany({ data: asistencias });

  console.log(`Usuario: ${USUARIO_DEMO.email} / ${USUARIO_DEMO.password}`);
  console.log(`Socios: ${socios.length}`);
  console.log(`Asistencias: ${asistencias.length}`);
}

main()
  .catch((error: unknown) => {
    console.error('Falló el seed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
