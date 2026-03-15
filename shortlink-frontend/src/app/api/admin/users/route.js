import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { links: true }
        },
        links: {
          select: { clicks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const activeCount = users.filter(u => u.isActive).length;
    const bannedCount = users.filter(u => !u.isActive).length;

    const formattedUsers = users.map(user => {
      const totalClicks = user.links.reduce((sum, link) => sum + link.clicks, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        initial: user.name.charAt(0).toUpperCase(),
        totalLinks: user._count.links,
        totalClicks: totalClicks,
        isActive: user.isActive,
        registeredOn: user.createdAt,
      };
    });

    return new Response(JSON.stringify({
      users: formattedUsers,
      summary: {
        active: activeCount,
        banned: bannedCount
      }
    }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
