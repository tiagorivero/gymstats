import { randomUUID } from 'node:crypto';
import { fakerES as faker } from '@faker-js/faker';
import { EstadoSocio } from '@prisma/client';
import { finDelDiaLocal, instanteLocal, sumarDias } from './fechas';

export interface SocioSemilla {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  fotoUrl: string | null;
  qrToken: string;
  venceEl: Date | null;
  estado: EstadoSocio;
  fechaAlta: Date;
  fechaBaja: Date | null;
  notas: string | null;
}

// distribucion de demo
const CANTIDADES = {
  alDia: 38,
  porVencer: 8,
  vencidos: 9,
  deBaja: 5,
} as const;

const DIAS_ANTIGUEDAD_MAXIMA = 540;
const DIAS_BAJA_MAXIMA = 120;
const DIAS_MINIMOS_DE_MEMBRESIA = 30;

const NOTAS = [
  'Lesión de rodilla, evitar sentadilla profunda.',
  'Paga en efectivo los primeros días del mes.',
  'Viene con la hermana, comparten rutina.',
  'Pidió rutina de hipertrofia.',
  'Alumno de la profe Carolina.',
  'Prefiere entrenar temprano.',
  'Descuento de estudiante hasta fin de año.',
  'Tiene apto médico vencido, avisar.',
];

function telefonoUruguayo(): string {
  return `09${faker.number.int({ min: 1, max: 9 })} ${faker.string.numeric(3)} ${faker.string.numeric(3)}`;
}

function sinAcentos(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

function correo(nombre: string, apellido: string): string {
  const dominio = faker.helpers.arrayElement(['gmail.com', 'hotmail.com', 'adinet.com.uy', 'vera.com.uy']);
  return `${sinAcentos(nombre)}.${sinAcentos(apellido)}${faker.number.int({ min: 1, max: 99 })}@${dominio}`;
}

function horarioDeMostrador(dia: Date): Date {
  return instanteLocal(dia, faker.number.int({ min: 9, max: 20 }), faker.number.int({ min: 0, max: 59 }));
}

function crearSocio(base: Pick<SocioSemilla, 'venceEl' | 'estado' | 'fechaAlta' | 'fechaBaja'>): SocioSemilla {
  const qrToken = randomUUID();
  const nombre = faker.person.firstName();
  const apellido = faker.person.lastName();

  return {
    id: randomUUID(),
    nombre,
    apellido,
    telefono: telefonoUruguayo(),
    email: faker.datatype.boolean(0.7) ? correo(nombre, apellido) : null,
    fotoUrl: `https://i.pravatar.cc/300?u=${qrToken}`,
    qrToken,
    notas: faker.datatype.boolean(0.2) ? faker.helpers.arrayElement(NOTAS) : null,
    ...base,
  };
}

function socioActivo(hoy: Date, diasHastaVencimiento: number): SocioSemilla {
  const antiguedadMinima = Math.max(1, DIAS_MINIMOS_DE_MEMBRESIA - diasHastaVencimiento);
  const diasDeAntiguedad = faker.number.int({ min: antiguedadMinima, max: DIAS_ANTIGUEDAD_MAXIMA });

  return crearSocio({
    estado: EstadoSocio.ACTIVO,
    fechaAlta: horarioDeMostrador(sumarDias(hoy, -diasDeAntiguedad)),
    fechaBaja: null,
    venceEl: finDelDiaLocal(sumarDias(hoy, diasHastaVencimiento)),
  });
}

function socioDeBaja(hoy: Date): SocioSemilla {
  const diasDesdeLaBaja = faker.number.int({ min: 1, max: DIAS_BAJA_MAXIMA });
  const diasDesdeElVencimiento = faker.number.int({ min: diasDesdeLaBaja, max: diasDesdeLaBaja + 15 });
  const diasDeAntiguedad = faker.number.int({
    min: diasDesdeLaBaja + DIAS_MINIMOS_DE_MEMBRESIA,
    max: DIAS_ANTIGUEDAD_MAXIMA,
  });

  return crearSocio({
    estado: EstadoSocio.INACTIVO,
    fechaAlta: horarioDeMostrador(sumarDias(hoy, -diasDeAntiguedad)),
    fechaBaja: horarioDeMostrador(sumarDias(hoy, -diasDesdeLaBaja)),
    venceEl: finDelDiaLocal(sumarDias(hoy, -diasDesdeElVencimiento)),
  });
}

export function generarSocios(hoy: Date): SocioSemilla[] {
  const socios: SocioSemilla[] = [];

  for (let i = 0; i < CANTIDADES.alDia; i += 1) {
    socios.push(socioActivo(hoy, faker.number.int({ min: 8, max: 40 })));
  }
  for (let i = 0; i < CANTIDADES.porVencer; i += 1) {
    socios.push(socioActivo(hoy, faker.number.int({ min: 0, max: 7 })));
  }
  for (let i = 0; i < CANTIDADES.vencidos; i += 1) {
    socios.push(socioActivo(hoy, -faker.number.int({ min: 1, max: 40 })));
  }
  for (let i = 0; i < CANTIDADES.deBaja; i += 1) {
    socios.push(socioDeBaja(hoy));
  }

  return faker.helpers.shuffle(socios);
}
