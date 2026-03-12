import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { code } = params;

    // TODO: ambil dari database
    // const data = await db.findByCode(code)
    // if (!data) return NextResponse.json({ error: 'Shortlink tidak ditemukan' }, { status: 404 })

    // Dummy response untuk sementara
    return NextResponse.json({
      code,
      originalUrl: 'https://example.com',
      clicks: 42,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
