'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for Offline PWA Support
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Service Worker registered successfully
          })
          .catch((err) => {
            // Registration failed
          });
      });
    }

    // 2. Offline / Online Status Listeners
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      if (!navigator.onLine) {
        setIsOffline(true);
      }

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div
      data-testid="offline-indicator"
      className="fixed bottom-16 right-4 z-[99999] px-3.5 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center space-x-2 text-amber-400 text-xs font-semibold animate-pulse select-none"
    >
      <WifiOff size={14} className="text-amber-400" />
      <span>Offline Mode — Web App Active</span>
    </div>
  );
}
