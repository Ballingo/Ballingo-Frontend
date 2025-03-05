import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "./ProfileIconStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetSkinImageMap } from "@/utils/imageMap";

interface ProfileIconProps {
  imageUrl?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  imageUrl,
  size = 80,
  style,
}) => {
  const router = useRouter();

  const handlePress = () => {
    console.log("Perfil clickeado");
    router.push("/profile");
  };
  const [actualLanguage, setActualLanguage] = useState<string>("");
  

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("ActualLanguage");
      setActualLanguage(storedLanguage || "en");
    }

    fetchLanguage();
  }, []);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={style}>
      <View
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Image
          source={
            PetSkinImageMap[actualLanguage]
          }
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileIcon;
