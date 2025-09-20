import React from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { Image } from 'expo-image';

export default function GaliantWaving() {
  const [lottieError, setLottieError] = React.useState(false);

  // Fallback to static image if Lottie fails (common on some phones)
  if (lottieError) {
    return (
      <View style={{ width: 220, height: 220, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require("../assets/images/galiant.png")}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <LottieView
      source={require("../assets/images/galiant-wave.json")}
      autoPlay
      loop
      style={{ width: 220, height: 220 }}
      onAnimationFinish={() => {
        // This helps with some phone compatibility issues
        console.log('Lottie animation loaded successfully');
      }}
      onError={(error) => {
        console.warn('Lottie animation failed, falling back to static image:', error);
        setLottieError(true);
      }}
    />
  );
}
