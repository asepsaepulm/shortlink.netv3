import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { incrementLinks } from '@/lib/statsTracker';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

function generateCode(length = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function sanitizeSlug(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/[-_.]{2,}/g, (m) => m[0])
    .replace(/^[-_.]|[-_.]$/g, '');
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const originalUrl = formData.get('originalUrl')?.toString().trim();
    const domain = formData.get('domain')?.toString().trim() || 'shortl.site';
    const slugInput = formData.get('slug')?.toString().trim() || '';
    const ogTitle = formData.get('ogTitle')?.toString().trim() || null;
    const ogImageUrl = formData.get('ogImageUrl')?.toString().trim() || null;
    const ogImageFile = formData.get('ogImageFile');

    if (!originalUrl) {
      return NextResponse.json({ error: 'Original URL wajib diisi' }, { status: 400 });
    }

    // ✅ Slug dipisah dari code — slug boleh duplikat, code selalu unik
    const slug = sanitizeSlug(slugInput); // boleh kosong

    // ✅ Selalu generate code unik (tidak peduli ada slug atau tidak)
    let code;
    let exists = true;
    while (exists) {
      code = generateCode(7);
      exists = await prisma.link.findUnique({ where: { code } });
    }

    // ✅ shortUrl: domain/CODE atau domain/CODE/slug
    const path = slug ? `${code}/${slug}` : code;
    const shortUrl = `https://${domain}/${path}`;

    let finalOgImageUrl = ogImageUrl;

    if (ogImageFile && typeof ogImageFile === 'object' && ogImageFile.size > 0) {
      try {
        const bytes = await ogImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = ogImageFile.name.split('.').pop();
        const filename = `og-${uniqueSuffix}.${ext}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        finalOgImageUrl = `https://${domain}/uploads/${filename}`;
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError);
      }
    }

    // ✅ Get userId from JWT if logged in
    let userId = null;
    try {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      }
    } catch (tokenErr) {
      console.error('Invalid or expired token during shorten:', tokenErr);
    }

    const link = await prisma.link.create({
      data: {
        code, // unik, dipakai untuk lookup redirect
        slug: slug || null, // opsional, boleh sama antar user
        domain,
        originalUrl, // ✅ Make sure this maps correctly
        shortUrl,
        ogTitle,
        ogImageUrl: finalOgImageUrl,
        userId: userId, // ✅ Associate with user if logged in
      },
    });

    // Increment local stats tracker
    await incrementLinks(1);

    return NextResponse.json({
      success: true,
      shortUrl,
      code,
    });
  } catch (error) {
    console.error('SHORTEN API ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
