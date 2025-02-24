import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./MoneyCounterStyles";
import { useRouter } from "expo-router";

interface MoneyCounterProps {
  value: number;
  color: string;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ value, color }) => {
  
  const router = useRouter();

  const handlePress = () => {
    console.log("Shop clicked");
    router.push("/shop");
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: `#${color}` },
        styles.moneyBackground,
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Image source={require("./assets/plus.png")} style={styles.plusIcon} />
      <Text style={styles.moneyText}>{value}</Text>
      <Image source={require("./assets/coins.png")} style={styles.moneyIcon} />
    </TouchableOpacity>
  );
};

export default MoneyCounter;
