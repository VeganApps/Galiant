import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface CustomBottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const SubtleGlow = ({ isActive }: { isActive: boolean }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulse.value, [0, 1], [0, 0.7]);
    const scale = interpolate(pulse.value, [0, 1], [1, 1.15]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.subtleGlow, animatedStyle]} />
  );
};

export default function CustomBottomNavigation({ 
  activeTab, 
  onTabPress 
}: CustomBottomNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('home')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'home' && styles.activeIconContainer
        ]}>
          <Ionicons 
            name="home" 
            size={24} 
            color={activeTab === 'home' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('history')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'history' && styles.activeIconContainer
        ]}>
          <Ionicons 
            name="refresh" 
            size={24} 
            color={activeTab === 'history' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
      
             <TouchableOpacity
               style={styles.centralButton}
               onPress={() => onTabPress('ai-chat')}
               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
               activeOpacity={0.85}
             >
               <SubtleGlow isActive={activeTab === 'ai-chat'} />
               <LinearGradient
                 colors={['#059669', '#10B981', '#34D399']}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
                 style={styles.centralButtonGradient}
               >
                 <View style={styles.centralIconContainer}>
                   <Ionicons name="chatbubbles" size={28} color="white" />
                 </View>
               </LinearGradient>
             </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('analytics')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'analytics' && styles.activeIconContainer
        ]}>
          <Ionicons 
            name="bar-chart" 
            size={24} 
            color={activeTab === 'analytics' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('support')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'support' && styles.activeIconContainer
        ]}>
          <Ionicons 
            name="headset" 
            size={24} 
            color={activeTab === 'support' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(60px)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 16,
    minHeight: 44,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: -8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(15px)',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.05 }],
    backdropFilter: 'blur(20px)',
  },
  centralButton: {
    marginTop: -22,
    position: 'relative',
  },
  centralButtonGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 18,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(25px)',
  },
  centralIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(12px)',
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtleGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
});
