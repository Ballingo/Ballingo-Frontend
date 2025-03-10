import React, { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import styles from "./MoneyCounterStyles";
import { useRouter } from "expo-router";
import { getPlayerCoins } from "@/api/inventory_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../loading-screen/LoadingScreen";

interface MoneyCounterProps {
  color: string;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ color }) => {
  
  const router = useRouter();
  const [coins, setCoins] = useState();
  const [loading, setLoading] = useState(true);

  const handlePress = () => {
    router.push("/shop");
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const playerId = await AsyncStorage.getItem("PlayerId");
        if (!playerId) {
          console.error("❌ No se encontró PlayerId en AsyncStorage");
          setLoading(false);
          return;
        }

        const { data, status } = await getPlayerCoins(playerId);

        if (status === 200) {
          setCoins(data.coins);
        } else {
          console.error(`❌ Error al obtener monedas: ${data.error} (${status})`);
        }
      } catch (error) {
        console.error("❌ Error en la API de monedas:", error);
      } finally {
        setLoading(false); // Finaliza la carga en cualquier caso
      }
    };

    fetchCoins();
  }, []);

  if (loading) {
    return (
      <View style={styles.fullScreenContainer}>
        <LoadingScreen />
      </View>
    );
  }

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
