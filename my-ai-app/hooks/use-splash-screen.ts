import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Prevent the splash screen from auto-hiding before App component declaration
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          // Add any custom fonts here
        });

        // Simulate loading time for demo purposes
        // In production, you might want to:
        // - Load user preferences
        // - Initialize analytics
        // - Check for app updates
        // - Load critical data
        await new Promise(resolve => setTimeout(resolve, 3000)); // Increased to 3 seconds
        
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Add a small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return {
    appIsReady,
    onLayoutRootView,
  };
}
