import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { styles } from "./SliderButtonStyles";

interface SliderButtonProps {
  leftLabel: string;
  rightLabel: string;
  onToggle: (isLeft: boolean) => void;
}

const SliderButton: React.FC<SliderButtonProps> = ({ leftLabel, rightLabel, onToggle }) => {
  const [isLeft, setIsLeft] = useState(true);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    const newValue = isLeft ? 1 : 0;
    Animated.timing(animatedValue, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsLeft(!isLeft);
    onToggle(!isLeft);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 105],
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={() => !isLeft && toggleSwitch()} style={styles.labelWrapper}>
            <Text style={[styles.label, isLeft ? styles.activeLabel : styles.inactiveLabel]}>
              {leftLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => isLeft && toggleSwitch()} style={styles.labelWrapper}>
            <Text style={[styles.label, !isLeft ? styles.activeLabel : styles.inactiveLabel]}>
              {rightLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SliderButton;
