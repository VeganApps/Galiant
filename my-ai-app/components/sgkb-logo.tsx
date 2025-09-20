import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface SGKBLogoProps {
  size?: number;
}

export default function SGKBLogo({ size = 24 }: SGKBLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={require('../assets/images/unnamed.webp')}
        style={[styles.logo, { width: size, height: size }]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
});
