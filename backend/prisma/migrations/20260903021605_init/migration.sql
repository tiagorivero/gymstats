-- CreateEnum
CREATE TYPE "estado_socio" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "foto_url" TEXT,
    "qr_token" TEXT NOT NULL,
    "vence_el" TIMESTAMP(3),
    "estado" "estado_socio" NOT NULL DEFAULT 'ACTIVO',
    "fecha_alta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_baja" TIMESTAMP(3),
    "notas" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socios_qr_token_key" ON "socios"("qr_token");

-- CreateIndex
CREATE INDEX "socios_estado_vence_el_idx" ON "socios"("estado", "vence_el");

-- CreateIndex
CREATE INDEX "socios_apellido_nombre_idx" ON "socios"("apellido", "nombre");

-- CreateIndex
CREATE INDEX "asistencias_fecha_idx" ON "asistencias"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_socio_id_fecha_key" ON "asistencias"("socio_id", "fecha");

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
