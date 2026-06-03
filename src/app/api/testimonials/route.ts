import { NextResponse } from 'next/server';
import { listTestimonialPhotos, hasCloudinary } from '@/lib/cloudinary';

const PAGE_SIZE = 12;

export async function GET(req: Request) {
  if (!hasCloudinary) {
    return NextResponse.json({ items: [], nextCursor: null });
  }
  const cursor = new URL(req.url).searchParams.get('cursor') || undefined;
  try {
    const data = await listTestimonialPhotos({ cursor, limit: PAGE_SIZE });
    return NextResponse.json(data, {
      // Cache at the edge for 5 min so we don't hit Cloudinary's API on every view.
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ items: [], nextCursor: null });
  }
}
