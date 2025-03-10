import React, { useEffect, useState } from "react";
import { View, ImageStyle, ViewStyle, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import styles from "./PetStyles";
import { PetSkinImageMap } from "@/utils/imageMap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClothesImageMap } from "@/utils/imageMap";
import { ClothesPositionByScreenMap } from "@/utils/positionMap";
import { getImagePathPetClothes } from "@/api/pet_api";




// Separar las props de estilo para View y Image
interface PetProps {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  type?: string;
  screen?: "index" | "inventory"; // Se agrega screen para determinar la posición del gorro
}

const Pet: React.FC<PetProps> = ({ containerStyle, imageStyle, type, screen = "inventory" }) => {
  const rotation = useSharedValue(0);
  const [actualLanguage, setActualLanguage] = useState<string>("");
  const [selectedClothes, setSelectedClothes] = useState<string[]>([]);



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


  useEffect(() => {

    const fetchClothes = async () => {
      try {
        const storedPetId = await AsyncStorage.getItem("PetId");
        if (!storedPetId) {
          alert("❌ No se encontró el ID de la mascota.");
          return;
        }

        const { data, status } = await getImagePathPetClothes(storedPetId);

        if (status === 200 && data.accesories_images) {
          const petClothesIds = data.accesories_images
          ? data.accesories_images.map((item: string) => item.toString())
          : [];
          setSelectedClothes(petClothesIds);
        }
      } catch (error) {
        console.error("❌ Error en fetchClothes:", error);
      }
    };

    fetchClothes();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Contenedor animado que incluye la bola y todos los accesorios */}
      <Animated.View style={[styles.petContainer, animatedStyle]}>
        {/* Renderizar cada accesorio en la posición correcta */}
        {selectedClothes.map((accessory) => {
          const accessoryImage = ClothesImageMap[accessory]; // Default
          const accessoryStyle =
            ClothesPositionByScreenMap[screen]?.[accessory];

          return (
            <Image key={accessory} source={accessoryImage} style={[styles.accessory, accessoryStyle]} />
          );
        })}

        {/* Imagen animada de la bola */}
        <Animated.Image source={PetSkinImageMap[actualLanguage]} style={[styles.image, imageStyle]} />
      </Animated.View>
    </View>
  );
};

export default Pet;

