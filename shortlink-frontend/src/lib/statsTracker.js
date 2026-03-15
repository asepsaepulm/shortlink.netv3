import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

// Define the path to our stats.json
const dataDir = path.join(process.cwd(), 'data');
const statsFile = path.join(dataDir, 'stats.json');
const leaderboardFile = path.join(dataDir, 'leaderboard.json');

// Ensure directory exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure the stats are initialized (Async so it can hit DB if missing)
export async function initStats() {
  if (!fs.existsSync(statsFile)) {
    try {
      console.log('[STATS TRACKER] Initializing from Database...');

      // Grab absolute counts directly from the DB
      const totalLinks = await prisma.link.count();
      const totalClicks = await prisma.linkClick.count();

      // Compute an estimate of "Active Users"
      // For realism based on DB, we can count distinct IPs in the last 15 minutes
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Try group by IP logic or fallback
      let activeUsers = 0;
      try {
        const recentClicks = await prisma.linkClick.groupBy({
          by: ['ipAddress'],
          where: { clickedAt: { gte: fifteenMinsAgo } },
        });
        activeUsers = Math.max(recentClicks.length, 1); // Minimum 1 if app is running
      } catch (e) {
        // Fallback if groupBy is slow or unsupported
        const recentCount = await prisma.linkClick.count({
          where: { clickedAt: { gte: fifteenMinsAgo } },
        });
        activeUsers = Math.max(Math.ceil(recentCount / 3), 1);
      }

      const initialStats = {
        linksCreated: totalLinks,
        clicksRecorded: totalClicks,
        activeUsers: activeUsers,
        lastActiveUserUpdate: Date.now(),
      };

      fs.writeFileSync(statsFile, JSON.stringify(initialStats, null, 2));
      console.log('[STATS TRACKER] Successfully seeded from DB:', initialStats);
    } catch (err) {
      console.error('[STATS TRACKER] Error seeding from DB:', err);
      // Fallback
      fs.writeFileSync(
        statsFile,
        JSON.stringify(
          {
            linksCreated: 0,
            clicksRecorded: 0,
            activeUsers: 1,
            lastActiveUserUpdate: Date.now(),
          },
          null,
          2,
        ),
      );
    }
  }
}

// Grab stats logic, maintaining the 5-min active user sampling
export async function getStats() {
  try {
    await initStats();
    const raw = fs.readFileSync(statsFile, 'utf8');
    const stats = JSON.parse(raw);

    // Update active users every 5 minutes (5 * 60 * 1000 ms)
    const now = Date.now();
    if (now - stats.lastActiveUserUpdate > 300000) {
      // Refresh active user estimate dynamically without heavy DB grouping
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentClicks = await prisma.linkClick.count({
        where: { clickedAt: { gte: fiveMinsAgo } },
      });
      // A realistic multiplier algorithm based on raw traffic volume
      stats.activeUsers = Math.max(Math.floor(recentClicks * 1.5), 1);
      stats.lastActiveUserUpdate = now;
      saveStats(stats);
    }

    return stats;
  } catch (err) {
    console.error('[STATS TRACKER] Read Error:', err);
    return { linksCreated: 0, clicksRecorded: 0, activeUsers: 1 };
  }
}

export async function incrementLinks(count = 1) {
  try {
    const stats = await getStats();
    stats.linksCreated += count;
    saveStats(stats);
  } catch (err) {
    console.error('Failed to increment links:', err);
  }
}

export async function incrementClicks(count = 1) {
  try {
    const stats = await getStats();
    stats.clicksRecorded += count;
    // For every click hitting the server, active presence increases naturally
    // Add small random bump to active users on burst traffic
    if (Math.random() < 0.2) {
      stats.activeUsers += 1;
    }
    saveStats(stats);
  } catch (err) {
    console.error('Failed to increment clicks:', err);
  }
}

function saveStats(stats) {
  try {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error('Failed to save stats:', err);
  }
}

// ---------------------------------------------------------------------------
// LEADERBOARD CACHING LOGIC
// ---------------------------------------------------------------------------

// Get top links, heavily cached on disk (refreshes every 30s max)
export async function getTopLeaderboard(limit = 10) {
  try {
    const now = Date.now();
    let cacheValid = false;

    // Check if cache exists and is fresh
    if (fs.existsSync(leaderboardFile)) {
      try {
        const raw = fs.readFileSync(leaderboardFile, 'utf8');
        const cache = JSON.parse(raw);

        // If cache is less than 5 seconds old, use it
        if (cache && cache.timestamp && now - cache.timestamp < 5000) {
          cacheValid = true;
          return cache.data;
        }
      } catch (parseErr) {
        console.warn('[LEADERBOARD] Cache invalid or corrupt, refreshing...');
      }
    }

    if (!cacheValid) {
      // Cache miss or stale -> Query the database grouped by user
      const topUsersGroups = await prisma.link.groupBy({
        by: ['userId'],
        where: { isActive: true },
        _sum: {
          clicks: true,
        },
        orderBy: {
          _sum: {
            clicks: 'desc',
          },
        },
        take: limit,
      });

      // We need user names since groupBy can't include relations
      // Extract all unique non-null userIds
      const userIds = topUsersGroups.filter((g) => g.userId !== null).map((g) => g.userId);

      let usersMap = {};
      if (userIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true },
        });
        users.forEach((u) => {
          usersMap[u.id] = u.name;
        });
      }

      // Format the data specifically for the frontend
      const formattedData = topUsersGroups.map((group) => {
        let name = 'Guest';
        if (group.userId && usersMap[group.userId]) {
          name = usersMap[group.userId];
        }

        return {
          user: name,
          clicks: group._sum.clicks || 0,
        };
      });

      // Combine duplicate Anonymous Users if there are any (e.g. if we grouped by null)
      // Actually `groupBy` with `userId` will automatically group all nulls into one row!

      fs.writeFileSync(
        leaderboardFile,
        JSON.stringify(
          {
            timestamp: now,
            data: formattedData,
          },
          null,
          2,
        ),
      );

      return formattedData;
    }
  } catch (err) {
    console.error('[LEADERBOARD] Fetch Error:', err);
    // Fallback if DB completely fails
    return [];
  }
}
