export type PresignUploadRequest = {
  sessionId: string;
  documentType: string;
  fileName: string;
  contentType: string;
  fileSize?: number;
};

export type PresignUploadResponse = {
  uploadUrl: string;
  fileKey: string;
  fileUrl?: string;
};

export type AssetUploadScope =
  | 'user_avatar'
  | 'partner_profile'
  | 'partner_cover'
  | 'partner_service_media';

export type PresignAssetUploadRequest = {
  scope: AssetUploadScope;
  partnerId?: string;
  serviceId?: string;
  draftId?: string;
  fileName: string;
  contentType: string;
  fileSize?: number;
};

export type UploadedAsset = {
  url: string;
  key: string;
  publicId?: string;
  contentType: string;
  fileName: string;
  size: number;
  provider?: 'firebase' | 's3';
};

export async function getOnboardingPresignedUploadUrl(
  payload: PresignUploadRequest
): Promise<PresignUploadResponse> {
  const res = await fetch('/api/uploads/onboarding/presign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to create upload URL');
  }

  return res.json();
}

export async function uploadFileToS3(uploadUrl: string, file: Blob) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file');
  }
}

export async function uploadImageAsset(
  payload: PresignAssetUploadRequest,
  file: File
): Promise<UploadedAsset> {
  const formData = new FormData();
  formData.set('file', file);
  formData.set('scope', payload.scope);
  formData.set('fileName', payload.fileName || file.name);
  formData.set('contentType', payload.contentType || file.type);
  formData.set('fileSize', String(payload.fileSize ?? file.size));

  if (payload.partnerId) formData.set('partnerId', payload.partnerId);
  if (payload.serviceId) formData.set('serviceId', payload.serviceId);
  if (payload.draftId) formData.set('draftId', payload.draftId);

  const res = await fetch('/api/uploads/images/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  return res.json();
}

export async function deleteImageAsset(payload: {
  fileKey: string;
  partnerId?: string;
}) {
  const res = await fetch('/api/uploads/images/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to delete image');
  }

  return res.json();
}
