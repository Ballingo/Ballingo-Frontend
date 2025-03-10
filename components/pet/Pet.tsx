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
import { getIsDead }from "@/api/pet_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Separar las props de estilo para View y Image
interface PetProps {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  type?: string;
}

const Pet: React.FC<PetProps> = ({ containerStyle, imageStyle, type }) => {
  const rotation = useSharedValue(0);
  const [actualLanguage, setActualLanguage] = useState<string>("");
  const [isDead, setIsDead] = useState<boolean>(false);

  useEffect(() => {
    let storedLanguage;
    const fetchLanguage = async () => {
      if (type === undefined) {
        storedLanguage = await AsyncStorage.getItem("ActualLanguage");
      } else {
        storedLanguage = type;
      }

      if (storedLanguage == null || storedLanguage === "null") {
        setActualLanguage("");
        return;
      }
      setActualLanguage(storedLanguage);
    };

    const fetchStatus = async () => {
      const petId = await AsyncStorage.getItem("PetId");
      const {data, status} = await getIsDead(petId);
      if(status === 200) {
        setIsDead(data.isDead);
      }
    };

    fetchLanguage();
    fetchStatus();

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
        source={ isDead === false ? PetSkinImageMap[actualLanguage] : PetSkinImageMap["ded"] }
        style={[styles.image, animatedStyle, imageStyle]}
      />
    </View>
  );
};

export default Pet;
