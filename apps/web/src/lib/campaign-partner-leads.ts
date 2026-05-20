import { getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyBvP1Fm5zzBXbJW442ITudkE4VruGjtIjs',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'droooly.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'droooly',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'droooly.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '118844553260',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:118844553260:web:83106d771be8cb55673989',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-E07TF5FRFW',
};

export interface CampaignPartnerLeadInput {
  name: string;
  phone: string;
  city: string;
  partnerType: string;
}

export function getFirebaseClientApp() {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function getCampaignPartnerLeadsQuery() {
  const db = getFirestore(getFirebaseClientApp());

  return query(
    collection(db, 'campaign_partner_leads'),
    orderBy('createdAt', 'desc')
  );
}

export function createCampaignPartnerLead(input: CampaignPartnerLeadInput) {
  const db = getFirestore(getFirebaseClientApp());

  return addDoc(collection(db, 'campaign_partner_leads'), {
    name: input.name,
    phone: input.phone,
    phoneVerified: true,
    city: input.city,
    partnerType: input.partnerType,
    status: 'new',
    source: 'landing_page',
    createdAt: serverTimestamp(),
  });
}
