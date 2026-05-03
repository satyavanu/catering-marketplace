/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBvP1Fm5zzBXbJW442ITudkE4VruGjtIjs',
  authDomain: 'droooly.firebaseapp.com',
  projectId: 'droooly',
  storageBucket: 'droooly.firebasestorage.app',
  messagingSenderId: '118844553260',
  appId: '1:118844553260:web:83106d771be8cb55673989',
  measurementId: 'G-E07TF5FRFW',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Droooly';
  const options = {
    body: payload.notification?.body || '',
    data: payload.data || {},
    icon: '/logo_rounded.png',
  };

  self.registration.showNotification(title, options);
});
