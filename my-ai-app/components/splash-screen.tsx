import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import GaliantWaving from './galiant-waving';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function SplashScreenComponent({ onAnimationFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#000000', '#1a1a1a'] : ['#ffffff', '#f8f9fa']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <GaliantWaving />
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingText}>
            <Text style={[styles.loadingTextStyle, { color: isDark ? '#ffffff' : '#1F2937' }]}>
              Loading Galiant...
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
