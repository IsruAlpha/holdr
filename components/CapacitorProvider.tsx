'use client';

import { useEffect, type ReactNode } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function CapacitorProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleAppUrlOpen = async (event: { url: string }) => {
      const url = new URL(event.url);

      if (url.hostname === 'auth-callback') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (code) {
          const params = new URLSearchParams({ code });
          if (state) params.set('state', state);
          window.location.href = `/callback?${params.toString()}`;
          return;
        }
      }

      if (url.origin !== window.location.origin) {
        window.location.href = event.url;
      }
    };

    const listener = App.addListener('appUrlOpen', handleAppUrlOpen);

    return () => {
      listener.then((l) => l?.remove());
    };
  }, []);

  return <>{children}</>;
}
