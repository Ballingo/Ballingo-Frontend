import React, { useEffect, useState } from "react";
import { View, ImageStyle, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import styles from "./PetStyles";
import { PetSkinImageMap } from "@/utils/imageMap";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Separar las props de estilo para View y Image
interface PetProps {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

const Pet: React.FC<PetProps> = ({ containerStyle, imageStyle }) => {
  const rotation = useSharedValue(0);
  const [actualLanguage, setActualLanguage] = useState<string>("");

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("ActualLanguage");

      if (storedLanguage == null || storedLanguage === "null") {
        setActualLanguage("");
        return;
      }
      setActualLanguage(storedLanguage);
    };

    fetchLanguage();

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

        source={PetSkinImageMap[actualLanguage]}
        style={[styles.image, animatedStyle, imageStyle]}
      />
    </View>
  );
};

export default Pet;
