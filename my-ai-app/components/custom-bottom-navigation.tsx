import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomBottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function CustomBottomNavigation({ 
  activeTab, 
  onTabPress 
}: CustomBottomNavigationProps) {
  return (
    <View style={styles.navContainer}>
      <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('home')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'home' && styles.activeIconContainer]}>
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
        <View style={[styles.iconContainer, activeTab === 'history' && styles.activeIconContainer]}>
          <Ionicons 
            name="refresh" 
            size={24} 
            color={activeTab === 'history' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('ai-chat')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'ai-chat' && styles.activeIconContainer]}>
          <Ionicons 
            name="chatbubbles" 
            size={24} 
            color={activeTab === 'ai-chat' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('analytics')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'analytics' && styles.activeIconContainer]}>
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
        <View style={[styles.iconContainer, activeTab === 'support' && styles.activeIconContainer]}>
          <Ionicons 
            name="headset" 
            size={24} 
            color={activeTab === 'support' ? "#10B981" : "rgba(139, 139, 139, 0.8)"} 
          />
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    // Outer container remains transparent; inner container floats
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: '90%',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)'
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 10,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
