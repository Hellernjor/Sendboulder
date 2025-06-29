
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.sendboulder.climbing',
  appName: 'SendBoulder',
  webDir: 'dist',
  server: {
    url: 'https://7460d030-49c9-4b8a-af5a-c459e7304d4f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
