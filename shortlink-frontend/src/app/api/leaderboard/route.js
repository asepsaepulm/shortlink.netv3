import { NextResponse } from 'next/server';
import { getTopLeaderboard } from '@/lib/statsTracker';

export async function GET() {
  try {
    const data = await getTopLeaderboard(10);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
      },
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
