import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catering-marketplace/auth';
import { createSign, randomUUID } from 'crypto';

const ALLOWED_SCOPES = new Set([
  'user_avatar',
  'partner_profile',
  'partner_cover',
  'partner_service_media',
]);

const ALLOWED_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const MAX_FILE_SIZE_MB = 8;

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

function getFileExtension(fileName: string) {
  const safeName = sanitizePart(fileName);
  const parts = safeName.split('.');
  return parts.length > 1 ? parts.pop() || 'bin' : 'bin';
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
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/devstorage.read_write',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const unsignedJwt = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(claimSet)
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
    throw new Error('Unable to authenticate Firebase storage upload');
  }

  const payload = await response.json();
  return String(payload.access_token || '');
}

function buildImageKey({
  scope,
  userId,
  partnerId,
  serviceId,
  draftId,
  fileName,
}: {
  scope: string;
  userId: string;
  partnerId?: string;
  serviceId?: string;
  draftId?: string;
  fileName: string;
}) {
  const extension = getFileExtension(fileName);
  const uniqueName = randomUUID();

  if (scope === 'user_avatar') {
    return `users/${sanitizePart(userId)}/avatar/${uniqueName}.${extension}`;
  }

  if (!partnerId) {
    throw new Error('partnerId is required for partner images');
  }

  if (scope === 'partner_profile') {
    return `partners/${sanitizePart(partnerId)}/profile/${uniqueName}.${extension}`;
  }

  if (scope === 'partner_cover') {
    return `partners/${sanitizePart(partnerId)}/cover/${uniqueName}.${extension}`;
  }

  const serviceSegment = serviceId
    ? `services/${sanitizePart(serviceId)}`
    : `services/drafts/${sanitizePart(draftId || uniqueName)}`;

  return `partners/${sanitizePart(partnerId)}/${serviceSegment}/media/${uniqueName}.${extension}`;
}

function buildMultipartBody({
  metadata,
  fileBuffer,
  contentType,
}: {
  metadata: Record<string, unknown>;
  fileBuffer: Buffer;
  contentType: string;
}) {
  const boundary = `droooly-${randomUUID()}`;
  const prefix = Buffer.from(
    [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(metadata),
      `--${boundary}`,
      `Content-Type: ${contentType}`,
      '',
      '',
    ].join('\r\n')
  );
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);

  return {
    boundary,
    body: Buffer.concat([prefix, fileBuffer, suffix]),
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const scope = String(formData.get('scope') || '');
    const partnerId = String(formData.get('partnerId') || '');
    const serviceId = String(formData.get('serviceId') || '');
    const draftId = String(formData.get('draftId') || '');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    if (!ALLOWED_SCOPES.has(scope)) {
      return NextResponse.json({ error: 'invalid scope' }, { status: 400 });
    }

    if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'invalid content type' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `file size must be less than ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    const sessionPartnerId = (session.user as any).partner?.id;

    if (
      scope !== 'user_avatar' &&
      String(partnerId || '') !== String(sessionPartnerId || '')
    ) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const bucket = process.env.FIREBASE_STORAGE_BUCKET;
    const userId = (session.user as any).id || (session.user as any).email;

    if (!bucket) {
      return NextResponse.json(
        { error: 'Firebase storage bucket is not configured' },
        { status: 500 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'user id not found in session' },
        { status: 401 }
      );
    }

    const fileKey = buildImageKey({
      scope,
      userId: String(userId),
      partnerId,
      serviceId,
      draftId,
      fileName: file.name,
    });
    const downloadToken = randomUUID();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const accessToken = await getGoogleAccessToken();
    const metadata = {
      name: fileKey,
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
        userId: String(userId),
        scope,
        ...(partnerId ? { partnerId } : {}),
        ...(serviceId ? { serviceId } : {}),
        ...(draftId ? { draftId } : {}),
      },
    };
    const { boundary, body } = buildMultipartBody({
      metadata,
      fileBuffer,
      contentType: file.type,
    });
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(
      bucket
    )}/o?uploadType=multipart`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    });

    if (!uploadResponse.ok) {
      throw new Error('Firebase image upload failed');
    }

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
      bucket
    )}/o/${encodeURIComponent(fileKey)}?alt=media&token=${downloadToken}`;

    return NextResponse.json({
      url: fileUrl,
      key: fileKey,
      publicId: fileKey,
      contentType: file.type,
      fileName: file.name,
      size: file.size,
      provider: 'firebase',
    });
  } catch (error) {
    console.error('[ImagesUpload] Error:', error);

    return NextResponse.json(
      { error: 'failed to upload image' },
      { status: 500 }
    );
  }
}
