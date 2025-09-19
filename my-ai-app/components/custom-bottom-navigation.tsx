import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? "#10B981" : "#666"} 
        />
        {activeTab === 'home' && <View style={styles.navDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('history')}
      >
        <Ionicons 
          name="refresh" 
          size={24} 
          color={activeTab === 'history' ? "#10B981" : "#666"} 
        />
        {activeTab === 'history' && <View style={styles.navDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.centralButton}
        onPress={() => onTabPress('ai-chat')}
      >
        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.centralButtonGradient}
        >
          <Ionicons name="chatbubbles" size={36} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('analytics')}
      >
        <Ionicons 
          name="bar-chart" 
          size={24} 
          color={activeTab === 'analytics' ? "#10B981" : "#666"} 
        />
        {activeTab === 'analytics' && <View style={styles.navDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => onTabPress('support')}
      >
        <Ionicons 
          name="headset" 
          size={24} 
          color={activeTab === 'support' ? "#10B981" : "#666"} 
        />
        {activeTab === 'support' && <View style={styles.navDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 90,
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    marginTop: 2,
  },
  centralButton: {
    marginTop: -35,
  },
  centralButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
