'use client';

import { useEffect, type ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

export function NativePlatformDetector({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      document.body.setAttribute('data-native', 'true');
    }
  }, []);

  return <>{children}</>;
}
