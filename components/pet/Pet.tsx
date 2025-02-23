import React, { useEffect } from "react";
import { View, ImageStyle, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import styles from "./PetStyles";

// Separar las props de estilo para View y Image
interface PetProps {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

const Pet: React.FC<PetProps> = ({ containerStyle, imageStyle }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2500 }),
        withTiming(-5, { duration: 2500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Image
        source={require("./assets/moringo.png")}
        style={[styles.image, animatedStyle, imageStyle]}
      />
    </View>
  );
};

export default Pet;
