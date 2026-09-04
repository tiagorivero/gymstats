import QRCode from 'qrcode';
import { prisma } from '../config/prisma';
import { noEncontrado } from '../utils/errors';

const OPCIONES: QRCode.QRCodeToDataURLOptions = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 512,
};

// el QR lleva solamente el qrToken no la url del endpoint
export const generarDeSocio = async (id: string): Promise<{ dataUrl: string }> => {
  const socio = await prisma.socio.findUnique({ where: { id }, select: { qrToken: true } });
  if (!socio) throw noEncontrado('No encontramos a ese socio.');

  return { dataUrl: await QRCode.toDataURL(socio.qrToken, OPCIONES) };
};
