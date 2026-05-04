import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catering-marketplace/auth';
import { createSign } from 'crypto';

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sanitizePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function getPrivateKey() {
  return (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error('Firebase service account is not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  const unsignedJwt = `${base64Url(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' })
  )}.${base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/devstorage.read_write',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  )}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedJwt);
  signer.end();

  const assertion = `${unsignedJwt}.${base64Url(signer.sign(privateKey))}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to authenticate Firebase storage delete');
  }

  const payload = await response.json();
  return String(payload.access_token || '');
}

function isAllowedImageKey(
  fileKey: string,
  userId: string,
  partnerId?: string
) {
  const safeUserId = sanitizePart(userId);
  const safePartnerId = partnerId ? sanitizePart(partnerId) : '';

  if (fileKey.startsWith(`users/${safeUserId}/`)) return true;
  if (safePartnerId && fileKey.startsWith(`partners/${safePartnerId}/`)) {
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { fileKey, partnerId } = await req.json();

    if (!fileKey || typeof fileKey !== 'string') {
      return NextResponse.json(
        { error: 'fileKey is required' },
        { status: 400 }
      );
    }

    const sessionPartnerId = (session.user as any).partner?.id;
    const hasPartnerKey = fileKey.startsWith('partners/');

    if (
      hasPartnerKey &&
      String(partnerId || '') !== String(sessionPartnerId || '')
    ) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const userId = String(
      (session.user as any).id || (session.user as any).email || ''
    );

    if (!userId || !isAllowedImageKey(fileKey, userId, partnerId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const bucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { error: 'Firebase storage bucket is not configured' },
        { status: 500 }
      );
    }

    const accessToken = await getGoogleAccessToken();
    const deleteUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(
      bucket
    )}/o/${encodeURIComponent(fileKey)}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      throw new Error('Firebase image delete failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ImagesDelete] Error:', error);

    return NextResponse.json(
      { error: 'failed to delete image' },
      { status: 500 }
    );
  }
}
