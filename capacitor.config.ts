
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7460d03049c94b8aaf5ac459e7304d4f',
  appName: 'boulder-flow-coach',
  webDir: 'dist',
  server: {
    url: 'https://7460d030-49c9-4b8a-af5a-c459e7304d4f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
