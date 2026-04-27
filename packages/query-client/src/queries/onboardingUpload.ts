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