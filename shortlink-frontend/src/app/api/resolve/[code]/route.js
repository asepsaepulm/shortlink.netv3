import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { code } = await params; // ← tambah await di sini!
    console.log('RESOLVE CODE:', code);

    const link = await prisma.link.findUnique({ where: { code } });
    console.log('LINK FOUND:', link);

    if (!link || !link.isActive) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.linkClick.create({
      data: {
        linkId: link.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
        referer: req.headers.get('referer') || null,
      },
    });

    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ originalUrl: link.originalUrl });
  } catch (err) {
    console.error('RESOLVE ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
