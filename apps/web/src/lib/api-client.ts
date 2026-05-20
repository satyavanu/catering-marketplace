const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type AuthIntent = 'login' | 'signup' | 'partner_onboarding';

export async function sendOtp(payload: {
  email?: string;
  phone?: string;
  intent?: AuthIntent;
}) {
  const response = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function verifyOtp(payload: {
  email?: string;
  phone?: string;
  otp: string;
  firebase_id_token?: string;
  firebaseIdToken?: string;
  intent?: AuthIntent;
}) {
  const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}
