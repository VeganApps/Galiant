import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";

import AppLayout from "@/components/app-layout";
import SplashScreenComponent from "@/components/splash-screen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSplashScreen } from "@/hooks/use-splash-screen";
import { TransactionProvider } from "../contexts/TransactionContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { appIsReady, onLayoutRootView } = useSplashScreen();

  // Debug logging for phone issues
  console.log("RootLayout render - appIsReady:", appIsReady);

  if (!appIsReady) {
    console.log("Showing splash screen");
    return <SplashScreenComponent />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <TransactionProvider>
          <AppLayout>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
              <Stack.Screen
                name="goal-detail"
                options={{ headerShown: false }}
              />
            </Stack>
          </AppLayout>
        </TransactionProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}
