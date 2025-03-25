import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.taskstodo',
  appName: 'tasks-todo',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Duration in milliseconds (3 seconds)
      launchAutoHide: true, // Automatically hide the splash screen after the duration
      backgroundColor: '#ffffff', // Background color of the splash screen
      androidSplashResourceName: 'splash', // Name of the splash screen resource
      androidScaleType: 'CENTER_INSIDE', // Scale type for the splash screen image
      showSpinner: false, // Show a loading spinner (optional)
    },
  },
};

export default config;