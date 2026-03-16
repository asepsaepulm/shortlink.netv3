import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function GET(req) {
  try {
    // Auth: extract user from JWT
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded.userId;
      } catch (_) {}
    }

    // Fetch user's own links
    const whereUser = userId ? { userId } : { userId: null };

    const [allLinks, totalClicks] = await Promise.all([
      prisma.link.findMany({
        where: whereUser,
        orderBy: { createdAt: 'desc' },
        select: {
          code: true,
          slug: true,
          domain: true,
          originalUrl: true,
          shortUrl: true,
          clicks: true,
          isActive: true,
          createdAt: true,
          ogTitle: true,
          ogImageUrl: true,
        },
      }),
      userId
        ? prisma.link.aggregate({
            where: { userId },
            _sum: { clicks: true },
          })
        : { _sum: { clicks: 0 } },
    ]);

    // Clicks today (local midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let clicksToday = 0;
    let clickHistory = [];

    // Initialize the last 7 days array
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      clickHistory.push({
        date: d.toISOString().slice(0, 10), // YYYY-MM-DD
        clicks: 0,
      });
    }

    if (userId) {
      const linkRecords = await prisma.link.findMany({
        where: { userId },
        select: { id: true },
      });
      const ids = linkRecords.map((l) => l.id);

      if (ids.length > 0) {
        // Clicks today
        clicksToday = await prisma.linkClick.count({
          where: {
            linkId: { in: ids },
            clickedAt: { gte: today },
          },
        });

        // Clicks history for chart (last 7 days including today)
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const recentClicks = await prisma.linkClick.findMany({
          where: {
            linkId: { in: ids },
            clickedAt: { gte: sevenDaysAgo },
          },
          select: { clickedAt: true },
        });

        // Group by local date string
        recentClicks.forEach((click) => {
          const dateStr = click.clickedAt.toISOString().slice(0, 10);
          const dayData = clickHistory.find((d) => d.date === dateStr);
          if (dayData) {
            dayData.clicks++;
          }
        });
      }
    }

    return NextResponse.json({
      totalLinks: allLinks.length,
      totalClicks: totalClicks._sum.clicks || 0,
      clicksToday,
      clickHistory,
      recentLinks: allLinks.slice(0, 100), // Most recent 100 for pagination
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
