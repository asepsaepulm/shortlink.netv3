import { NextResponse } from 'next/server';
import { incrementLinks } from '@/lib/statsTracker';

export async function POST(req) {
  try {
    const { urls, domain } = await req.json();
    if (!urls?.length) return NextResponse.json({ error: 'URLs wajib diisi' }, { status: 400 });

    const results = urls.slice(0, 100).map((url) => {
      const code = Math.random().toString(36).substring(2, 8);
      return { original: url, short: `https://${domain}/${code}` };
    });

    // TODO: simpan semua ke database

    // Increment local stats tracker
    await incrementLinks(results.length);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
