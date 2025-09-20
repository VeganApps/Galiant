import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';

import CustomBottomNavigation from './custom-bottom-navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/explore') return 'explore';
    if (pathname === '/history') return 'history';
    if (pathname === '/ai-chat') return 'ai-chat';
    if (pathname === '/analytics') return 'analytics';
    if (pathname === '/support') return 'support';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    
    switch (tabName) {
      case 'home':
        router.push('/(tabs)/');
        break;
      case 'explore':
        router.push('/(tabs)/explore');
        break;
      case 'history':
        router.push('/(tabs)/history');
        break;
      case 'ai-chat':
        router.push('/(tabs)/ai-chat');
        break;
      case 'analytics':
        router.push('/(tabs)/analytics');
        break;
      case 'support':
        router.push('/(tabs)/support');
        break;
      default:
        router.push('/(tabs)/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.bottomNavContainer}>
        <CustomBottomNavigation 
          activeTab={activeTab} 
          onTabPress={handleTabPress} 
        />
      </View>
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
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
});
