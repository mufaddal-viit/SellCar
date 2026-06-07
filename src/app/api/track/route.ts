import { NextResponse } from 'next/server';
import { prisma, hasDb } from '@/lib/db/prisma';

export async function POST(req: Request) {
  if (!hasDb) return new NextResponse(null, { status: 204 });
  try {
    const body = await req.json();
    const type = body?.type;
    if (type !== 'whatsapp' && type !== 'call') {
      return new NextResponse(null, { status: 204 });
    }
    await prisma.lead.create({
      data: {
        type,
        carId: typeof body.carId === 'string' ? body.carId : null,
        carName: typeof body.carName === 'string' ? body.carName : null,
        status: 'new', // surface WhatsApp/call clicks as actionable leads
      },
    });
  } catch {
    // Best-effort tracking — never error to the client.
  }
  return new NextResponse(null, { status: 204 });
}
