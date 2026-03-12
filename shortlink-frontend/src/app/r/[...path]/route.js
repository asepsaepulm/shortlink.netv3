import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    // params.path bisa ['TZbAgZo'] atau ['TZbAgZo', 'nama-slug']
    const [code] = params.path;

    if (!code) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const link = await prisma.link.findUnique({ where: { code } });

    if (!link || !link.isActive) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Simpan detail klik
    await prisma.linkClick.create({
      data: {
        linkId: link.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        userAgent: req.headers.get('user-agent') || null,
        referer: req.headers.get('referer') || null,
      },
    });

    // Increment counter
    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.redirect(link.originalUrl, { status: 301 });
  } catch (err) {
    console.error('REDIRECT ERROR:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
