import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'space.linkroot.holdr',
  appName: 'holdr',
  webDir: 'public',
  server: {
    url: 'https://holdr.linkroot.space',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'holdr.linkroot.space',
      '*.authkit.app',
      'api.workos.com',
      '*.workos.com',
      'accounts.google.com',
      'oauth2.googleapis.com',
      'appleid.apple.com',
      'id.apple.com',
    ],
  },
};

export default config;
