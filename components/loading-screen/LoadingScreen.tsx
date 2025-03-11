import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';

const LoadingScreen: React.FC = () => {
  const [progress] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animar la barra de progreso
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Animar la bola con rebote
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animar el texto con un efecto de opacidad
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      {/* Fondo con gradiente */}
      <Animated.View style={styles.gradientBackground} />

      {/* Animación de la bola */}
      <Animated.Image 
        source={require('@/assets/pets/ar_eyes.png')} 
        style={[styles.ball, { transform: [{ translateY: bounceAnim }] }]}
      />

      {/* Texto con opacidad animada */}
      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        Loading...
      </Animated.Text>

      {/* Barra de progreso animada */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Color oscuro para resaltar elementos
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000, // Asegurar que esté por encima de todo
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'linear-gradient(180deg, #1E293B 0%, #4F46E5 100%)',
  },
  ball: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '80%',
    height: 12,
    backgroundColor: '#475569',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 6,
  },
});

export default LoadingScreen;
