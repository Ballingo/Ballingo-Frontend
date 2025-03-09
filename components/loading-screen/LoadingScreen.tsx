import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/pets/ar.png')} // Reemplaza con la imagen de la bola
        style={styles.ball}
      />
      <Text style={styles.loadingText}>Loading...</Text>
      <Animated.View style={[styles.progressBar, { width: progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
      }) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B8F8C6', // Color de fondo similar a tu app
  },
  ball: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: 'red',
    borderRadius: 5,
  }
});

export default LoadingScreen;
