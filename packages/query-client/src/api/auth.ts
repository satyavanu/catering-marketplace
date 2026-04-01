import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SendOtpPayload {
  email?: string;
  phone?: string;
}

interface VerifyOtpPayload {
  email?: string;
  phone?: string;
  otp: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.message || 'An error occurred',
      message: data.message,
    };
  }

  return {
    success: true,
    data,
    message: data.message,
  };
}

// Raw API calls (for non-React usage)
async function sendOtpApi(payload: SendOtpPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
}

async function verifyOtpApi(payload: VerifyOtpPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
    };
  }
}

// TanStack Query Hooks
export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => sendOtpApi(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtpApi(payload),
  });
}

// Export raw API functions for non-React usage
export { sendOtpApi, verifyOtpApi };