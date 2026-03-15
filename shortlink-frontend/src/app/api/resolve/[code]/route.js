import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { incrementClicks } from '@/lib/statsTracker';

export async function GET(req, { params }) {
  try {
    const { code } = await params; // ← tambah await di sini!
    console.log('RESOLVE CODE:', code);

    const link = await prisma.link.findUnique({ where: { code } });
    console.log('LINK FOUND:', link);

    if (!link || !link.isActive) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // ✅ Skip click tracking for bots
    const userAgent = req.headers.get('user-agent') || '';
    const isBot = /bot|facebookexternalhit|whatsapp|twitter|pinterest|vkShare|telegram|linkedin|slack|discord|skype|viber/i.test(userAgent);

    if (!isBot) {
      await prisma.linkClick.create({
        data: {
          linkId: link.id,
          ipAddress: req.headers.get('x-forwarded-for') || null,
          userAgent: userAgent,
          referer: req.headers.get('referer') || null,
        },
      });

      await prisma.link.update({
        where: { code },
        data: { clicks: { increment: 1 } },
      });

      // Increment global hero stats
      await incrementClicks(1);
    } else {
      console.log(`[RESOLVE API] Ignored Bot Click: ${userAgent}`);
    }

    return NextResponse.json({
      originalUrl: link.originalUrl,
      ogTitle: link.ogTitle,
      ogImageUrl: link.ogImageUrl
    });
  } catch (err) {
    console.error('RESOLVE ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
