import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const logs = await prisma.linkClick.findMany({
      take: 100,
      orderBy: { clickedAt: 'desc' },
      include: {
        link: true,
      },
    });

    const formattedLogs = logs.map(log => ({
      id: log.id,
      time: log.clickedAt,
      url: log.link ? `https://${log.link.domain}/${log.link.code}` : 'Unknown',
      target: log.link ? log.link.originalUrl : 'Unknown',
      country: log.country || 'Unknown',
      device: log.userAgent ? parseDevice(log.userAgent) : 'Unknown',
    }));

    return new Response(JSON.stringify(formattedLogs), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

function parseDevice(userAgent) {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}
