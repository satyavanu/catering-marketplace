'use client';

import { useEffect } from 'react';
import { registerNotificationDeviceToken } from '@catering-marketplace/query-client';

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

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export default function FirebaseNotificationRegistration() {
  useEffect(() => {
    let cancelled = false;

    const register = async () => {
      if (!vapidKey || typeof window === 'undefined') return;
      if (!('Notification' in window) || !('serviceWorker' in navigator))
        return;

      const permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission;

      if (permission !== 'granted' || cancelled) return;

      const [{ initializeApp, getApps }, { getMessaging, getToken }] =
        await Promise.all([
          import('firebase/app'),
          import('firebase/messaging'),
        ]);

      const app = getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!token || cancelled) return;

      await registerNotificationDeviceToken({
        token,
        platform: 'web',
        device_id: navigator.userAgent,
        user_agent: navigator.userAgent,
      });
    };

    register().catch((error) => {
      console.warn('[Notifications] Firebase registration failed', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
