import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      partnerId,
      signatureImage,
      signedAgreementPDF,
      termsAccepted,
      privacyAccepted,
      signedAt,
      ipAddress,
    } = req.body;

    // Generate unique document ID
    const documentId = `AGR_${partnerId}_${Date.now()}`;

    // Upload signature image to S3
    const signatureKey = `signatures/${documentId}_signature.png`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: signatureKey,
        Body: Buffer.from(signatureImage.split(',')[1], 'base64'),
        ContentType: 'image/png',
      })
    );

    // Upload PDF to S3
    const pdfKey = `agreements/${documentId}_agreement.pdf`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: pdfKey,
        Body: Buffer.from(signedAgreementPDF, 'base64'),
        ContentType: 'application/pdf',
      })
    );

    // Save record to database
    const signedAgreement = await prisma.signedAgreement.create({
      data: {
        documentId,
        partnerId,
        signatureS3Url: `s3://${process.env.AWS_S3_BUCKET}/${signatureKey}`,
        agreementPdfS3Url: `s3://${process.env.AWS_S3_BUCKET}/${pdfKey}`,
        termsAccepted,
        privacyAccepted,
        signedAt: new Date(signedAt),
        ipAddress,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(200).json({
      success: true,
      documentId,
      downloadUrl: `/api/onboarding/download-agreement?docId=${documentId}`,
    });
  } catch (error) {
    console.error('Error saving agreement:', error);
    res.status(500).json({ error: 'Failed to save signed agreement' });
  }
}