import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



const ALLOWED_DOCUMENT_TYPES = new Set([
  'pan',
  'gst',
  'fssai',
  'bank_proof',
  'partner_agreement',
  'signature',
]);

const ALLOWED_CONTENT_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/json',
]);

const MAX_FILE_SIZE_MB = 10;

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function getFileExtension(fileName: string) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : 'bin';
}

export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      sessionId,
      documentType,
      fileName,
      contentType,
      fileSize,
    } = body;

    if (!sessionId || !documentType || !fileName || !contentType) {
      return NextResponse.json(
        { error: 'sessionId, documentType, fileName and contentType are required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_DOCUMENT_TYPES.has(documentType)) {
      return NextResponse.json(
        { error: 'invalid document type' },
        { status: 400 }
      );
    }

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'invalid content type' },
        { status: 400 }
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `file size must be less than ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    const bucket = process.env.AWS_S3_ONBOARDING_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { error: 'S3 bucket is not configured' },
        { status: 500 }
      );
    }

    const userId = (session.user as any).id 
    if (!userId) {
      return NextResponse.json(
        { error: 'user id not found in session' },
        { status: 401 }
      );
    }

    const safeFileName = sanitizeFileName(fileName);
    const extension = getFileExtension(safeFileName);
    const timestamp = Date.now();

    const fileKey = [
      'draft',
      'onboarding',
      userId,
      sessionId,
      documentType,
      `${documentType}-${timestamp}.${extension}`,
    ].join('/');

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: contentType,
      Metadata: {
        userId: String(userId),
        onboardingSessionId: String(sessionId),
        documentType: String(documentType),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5,
    });

    const publicBaseUrl = process.env.AWS_S3_ONBOARDING_PUBLIC_BASE_URL;

    return NextResponse.json({
      uploadUrl,
      fileKey,
      fileUrl: publicBaseUrl ? `${publicBaseUrl}/${fileKey}` : null,
      expiresIn: 300,
    });
  } catch (error) {
    console.error('[OnboardingPresignUpload] Error:', error);

    return NextResponse.json(
      { error: 'failed to generate upload URL' },
      { status: 500 }
    );
  }
}