import { NextResponse } from 'next/server';
import { getStats } from '@/lib/statsTracker';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero stats' }, { status: 500 });
  }
}
