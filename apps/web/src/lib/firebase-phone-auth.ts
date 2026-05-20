import type { Auth } from 'firebase/auth';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirebaseClientApp } from '@/lib/campaign-partner-leads';

const recaptchaVerifiers = new Map<string, RecaptchaVerifier>();

function getRecaptchaVerifier(auth: Auth, containerId: string) {
  const existingVerifier = recaptchaVerifiers.get(containerId);
  if (existingVerifier) return existingVerifier;

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  });
  recaptchaVerifiers.set(containerId, verifier);

  return verifier;
}

export function resetFirebasePhoneRecaptcha(containerId: string) {
  recaptchaVerifiers.get(containerId)?.clear();
  recaptchaVerifiers.delete(containerId);
}

export async function sendFirebasePhoneOtp(
  phone: string,
  recaptchaContainerId: string
) {
  const auth = getAuth(getFirebaseClientApp());
  const verifier = getRecaptchaVerifier(auth, recaptchaContainerId);

  try {
    return await signInWithPhoneNumber(auth, phone, verifier);
  } catch (error) {
    resetFirebasePhoneRecaptcha(recaptchaContainerId);
    throw error;
  }
}
