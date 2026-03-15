/**
 * statsTracker.js
 *
 * Serverless-compatible stats & leaderboard tracker.
 * Uses in-memory (module-level) caches instead of the local filesystem,
 * so it works on Vercel, Railway, Render, and any other serverless host.
 *
 * NOTE: In-memory state is per-process. On serverless platforms each invocation
 * may be a fresh instance, so the cache falls through to the DB — which is fine;
 * that's their "correct" behaviour. The cache just prevents hammering the DB
 * across requests that land on the same warm instance.
 */

import { prisma } from './prisma';

// ---------------------------------------------------------------------------
// IN-MEMORY STATS CACHE
// ---------------------------------------------------------------------------

let statsCache = null;        // { linksCreated, clicksRecorded, activeUsers, lastActiveUserUpdate }
let statsCacheTime = 0;       // timestamp of last DB seed
const STATS_TTL = 10_000;     // 10 seconds

async function loadStats() {
  const now = Date.now();
  // If we have a fresh cache, return it immediately
  if (statsCache && (now - statsCacheTime < STATS_TTL)) {
    return statsCache;
  }

  try {
    const [totalLinks, totalClicks] = await Promise.all([
      prisma.link.count(),
      prisma.linkClick.count(),
    ]);

    const fiveMinsAgo = new Date(now - 5 * 60 * 1000);
    let activeUsers = 1;
    try {
      const recentGroups = await prisma.linkClick.groupBy({
        by: ['ipAddress'],
        where: { clickedAt: { gte: fiveMinsAgo } },
      });
      activeUsers = Math.max(recentGroups.length, 1);
    } catch (_) {
      const recentCount = await prisma.linkClick.count({
        where: { clickedAt: { gte: fiveMinsAgo } },
      });
      activeUsers = Math.max(Math.ceil(recentCount / 3), 1);
    }

    statsCache = {
      linksCreated: totalLinks,
      clicksRecorded: totalClicks,
      activeUsers,
      lastActiveUserUpdate: now,
    };
    statsCacheTime = now;
  } catch (err) {
    console.error('[STATS TRACKER] DB error loading stats:', err);
    // Return stale cache if we have one, otherwise default zeros
    if (!statsCache) {
      statsCache = { linksCreated: 0, clicksRecorded: 0, activeUsers: 1, lastActiveUserUpdate: now };
    }
  }

  return statsCache;
}

/**
 * Public: return current hero stats (always from DB on first call / after TTL).
 */
export async function getStats() {
  return await loadStats();
}

/**
 * Public: called after a new link is created.
 * Bumps the in-memory counter optimistically; DB is the source of truth.
 */
export async function incrementLinks(count = 1) {
  const stats = await loadStats();
  stats.linksCreated += count;
}

/**
 * Public: called after a real (non-bot) click is recorded.
 */
export async function incrementClicks(count = 1) {
  const stats = await loadStats();
  stats.clicksRecorded += count;
  if (Math.random() < 0.2) {
    stats.activeUsers += 1;
  }
}

// ---------------------------------------------------------------------------
// IN-MEMORY LEADERBOARD CACHE
// ---------------------------------------------------------------------------

let leaderboardCache = null;   // array of { user, clicks }
let leaderboardCacheTime = 0;  // ms
const LEADERBOARD_TTL = 5_000; // 5 seconds

/**
 * Public: return grouped leaderboard (users ordered by total clicks descending).
 */
export async function getTopLeaderboard(limit = 10) {
  const now = Date.now();

  // Return fresh cache if available
  if (leaderboardCache && (now - leaderboardCacheTime < LEADERBOARD_TTL)) {
    return leaderboardCache;
  }

  try {
    // Group all active links by userId, summing their clicks
    const topUsersGroups = await prisma.link.groupBy({
      by: ['userId'],
      where: { isActive: true },
      _sum: { clicks: true },
      orderBy: { _sum: { clicks: 'desc' } },
      take: limit,
    });

    // Fetch names for non-null userIds
    const userIds = topUsersGroups
      .filter((g) => g.userId !== null)
      .map((g) => g.userId);

    const usersMap = {};
    if (userIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });
      users.forEach((u) => { usersMap[u.id] = u.name; });
    }

    const formattedData = topUsersGroups.map((group) => ({
      user: (group.userId && usersMap[group.userId]) ? usersMap[group.userId] : 'Guest',
      clicks: group._sum.clicks || 0,
    }));

    // Store in-memory cache
    leaderboardCache = formattedData;
    leaderboardCacheTime = now;

    return formattedData;
  } catch (err) {
    console.error('[LEADERBOARD] Fetch Error:', err);
    return leaderboardCache || [];
  }
}
