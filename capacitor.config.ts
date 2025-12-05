import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.taskstodo',
  appName: 'Tasks Todo',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    // Remove SplashScreen config entirely
    CapacitorHttp: {
      enabled: true
    }
  },
};

export default config;