import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import CustomBottomNavigation from "./custom-bottom-navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname === "/explore") return "explore";
    if (pathname === "/history") return "history";
    if (pathname === "/ai-chat") return "ai-chat";
    if (pathname === "/analytics") return "analytics";
    if (pathname === "/support") return "support";
    return "home";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  const handleTabPress = (tabName: string) => {
    if (tabName === activeTab) return; // Prevent same tab taps

    setActiveTab(tabName);

    switch (tabName) {
      case "home":
        router.push("/");
        break;
      case "explore":
        router.push("/explore");
        break;
      case "history":
        router.push("/history");
        break;
      case "ai-chat":
        router.push("/ai-chat");
        break;
      case "analytics":
        router.push("/analytics");
        break;
      case "support":
        router.push("/support");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Animated.View
        style={[styles.bottomNavContainer]}
        entering={FadeInUp.duration(300).springify()}
      >
        <CustomBottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 0,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
  },
});
