import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.taskstodo',
  appName: 'Tasks Todo',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Duration in milliseconds (2 seconds)
      launchAutoHide: true, // Automatically hide the splash screen after the duration
      launchFadeOutDuration: 500, // Fade out animation duration
      backgroundColor: '#f8fafc', // Light gray background color
      androidSplashResourceName: 'splash', // Name of the splash screen resource
      androidScaleType: 'CENTER_CROP', // Scale type for better full-screen coverage
      showSpinner: false, // No loading spinner
      splashFullScreen: true, // Full screen splash (no status bar)
      splashImmersive: true, // Immersive mode (hides navigation bar too)
    },
  },
};

export default config;