import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./HungerBarStyles";
import { getHungerBar } from "@/api/pet_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HungerBarProps {
  width: number;
}

const HungerBar: React.FC<HungerBarProps> = ({ width }) => {
  const [hungerBar, setHungerBar] = useState<number>(100);
  
  useEffect(() => {
    const fetchHungerBar = async () => {
      const petId = await AsyncStorage.getItem("PetId");

      if (!petId){
        console.error("❌ Couldn't get find pet");
        return
      }

      const {data, status} = await getHungerBar(petId);

      if (status === 200) {
        console.log("✅ Hunger bar data:", data);
        setHungerBar(data.hunger);
      }
      else {
        console.error("❌ Error getting hunger bar:", data);
      }

    };
    fetchHungerBar();
  }, []);

  return (
    <View style={[styles.container, { width: `${width}%` }]}>
      <Image
        source={require("./assets/chicken.png")}
        style={[styles.icon, { left: `${hungerBar}%` }]}
      />

      <View style={styles.barBackground}>
        <LinearGradient
          colors={["#ff0000", "#ff8c00", "#ffff00", "#32cd32"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />

        <View style={[styles.barFill, { width: `${100 - hungerBar}%` }]} />
      </View>
    </View>
  );
};

export default HungerBar;
