import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const links = await prisma.link.findMany({
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const activeCount = links.filter(l => l.isActive).length;
    const bannedCount = links.filter(l => !l.isActive).length;

    const formattedLinks = links.map(link => ({
      id: link.id,
      shortUrl: `https://${link.domain}/${link.code}`,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      owner: link.user ? link.user.name : 'Unknown',
      isActive: link.isActive,
      createdAt: link.createdAt,
      ogTitle: link.ogTitle,
      ogImageUrl: link.ogImageUrl,
    }));

    return new Response(JSON.stringify({
      links: formattedLinks,
      summary: {
        active: activeCount,
        banned: bannedCount
      }
    }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
