'use client';

import { useEffect } from 'react';

export default function PWAProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New version available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        // Wait a bit before asking, don't want to be too aggressive
        setTimeout(() => {
          Notification.requestPermission();
        }, 10000);
      }
    }
  }, []);

  return null;
}
