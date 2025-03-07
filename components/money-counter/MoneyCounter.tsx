import React, { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import styles from "./MoneyCounterStyles";
import { useRouter } from "expo-router";
import { getPlayerCoins } from "@/api/inventory_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MoneyCounterProps {
  color: string;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ color }) => {
  
  const router = useRouter();
  const [coins, setCoins] = useState();

  const handlePress = () => {
    router.push("/shop");
  };

  useEffect(() => {
    const fetchCoins = async () => {
      const playerId = await AsyncStorage.getItem("PlayerId");
      const {data, status} = await getPlayerCoins(playerId);

      if (status === 200) {
        setCoins(data.coins);
      }
      else{
        console.error(`${data.error}: ${status}`);
      }
    };

    fetchCoins();
  }, []);

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
      <Text style={styles.moneyText}>{coins}</Text>
      <Image source={require("./assets/coins.png")} style={styles.moneyIcon} />
    </TouchableOpacity>
  );
};

export default MoneyCounter;
