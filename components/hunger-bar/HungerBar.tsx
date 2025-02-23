import React from "react";
import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./HungerBarStyles";

interface HungerBarProps {
  hungerLevel: number;
}

const HungerBar: React.FC<HungerBarProps> = ({ hungerLevel }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/chicken.png")}
        style={[styles.icon, { left: `${hungerLevel}%` }]}
      />

      <View style={styles.barBackground}>
        <LinearGradient
          colors={["#ff0000", "#ff8c00", "#ffff00", "#32cd32"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />

        <View style={[styles.barFill, { width: `${100 - hungerLevel}%` }]} />
      </View>
    </View>
  );
};

export default HungerBar;
