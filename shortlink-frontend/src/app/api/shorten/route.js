import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
      // TODO: upload ke Cloudinary/S3
    }

    const link = await prisma.link.create({
      data: {
        code, // unik, dipakai untuk lookup redirect
        slug: slug || null, // opsional, boleh sama antar user
        domain,
        originalUrl,
        shortUrl,
        ogTitle,
        ogImageUrl: finalOgImageUrl,
      },
    });

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
