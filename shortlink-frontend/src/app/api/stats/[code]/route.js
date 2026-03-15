import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { code } = await params;
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) return NextResponse.json({ error: 'Shortlink tidak ditemukan' }, { status: 404 });

    return NextResponse.json({
      code: link.code,
      shortUrl: link.shortUrl,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      domain: link.domain,
      createdAt: link.createdAt,
      ogTitle: link.ogTitle, // ✅ tambah
      ogImageUrl: link.ogImageUrl, // ✅ tambah
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
