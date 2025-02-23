import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./MoneyCounterStyles";

interface MoneyCounterProps {
  value: number;
  color: string;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ value, color }) => {
  return (
    <View
      style={[
        styles.container,
        { borderColor: `#${color}` },
        styles.moneyBackground,
      ]}
    >
      <Image source={require("./assets/plus.png")} style={styles.plusIcon} />
      <Text style={styles.moneyText}>{value}</Text>
      <Image source={require("./assets/coins.png")} style={styles.moneyIcon} />
    </View>
  );
};

export default MoneyCounter;
