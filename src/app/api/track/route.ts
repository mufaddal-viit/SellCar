import { NextResponse } from 'next/server';
import { prisma, hasDb } from '@/lib/db/prisma';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!hasDb) return new NextResponse(null, { status: 204 });

  const ip = clientIp(req);
  if (!rateLimit(`track:${ip}`, 30, 60 * 1000)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = await req.json();
    const type = body?.type;
    if (type !== 'whatsapp' && type !== 'call') {
      return new NextResponse(null, { status: 204 });
    }
    const carId = typeof body.carId === 'string' ? body.carId.slice(0, 30) : null;
    const carName = typeof body.carName === 'string' ? body.carName.slice(0, 120) : null;
    await prisma.lead.create({
      data: { type, carId, carName, status: 'new' },
    });
  } catch {
    // Best-effort tracking — never error to the client.
  }
  return new NextResponse(null, { status: 204 });
}
