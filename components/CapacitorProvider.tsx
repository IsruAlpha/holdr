'use client';

import { useEffect, type ReactNode } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function CapacitorProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleAppUrlOpen = async (event: { url: string }) => {
      const url = new URL(event.url);

      // Handle space.linkroot.holdr://auth-callback?code=...&state=...
      // This is where WorkOS magic links and OAuth callbacks land
      if (url.hostname === 'auth-callback') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (code) {
          const params = new URLSearchParams({ code });
          if (state) params.set('state', state);
          window.location.href = `https://holdr.linkroot.space/callback?${params.toString()}`;
          return;
        }
      }

      // Handle https://holdr.linkroot.space/callback?code=...&state=...
      // In case the deep link already resolved to the web URL
      if (url.origin === 'https://holdr.linkroot.space' && url.pathname === '/callback') {
        if (window.location.href !== url.href) {
          window.location.href = url.href;
        }
        return;
      }

      // For any other external URL, navigate the WebView
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
