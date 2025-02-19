import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import styles from './PetStyles';

const Pet: React.FC = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animación en bucle de 10 grados a la derecha y a la izquierda
    rotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2500 }), // Gira 10 grados a la derecha
        withTiming(-5, { duration: 2500 }) // Gira 10 grados a la izquierda
      ),
      -1, // Repetir infinitamente
      true // Alternar la dirección
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./assets/moringo.png')}
        style={[styles.image, animatedStyle]}
      />
    </View>
  );
};

export default Pet;
