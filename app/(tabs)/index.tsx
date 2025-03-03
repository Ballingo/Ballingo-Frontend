import { ImageBackground, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Importar AsyncStorage
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import Pet from "@/components/pet/Pet";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import HungerBar from "@/components/hunger-bar/HungerBar";
import FoodBar from "@/components/food-bar/FoodBar";
import { addFoodToPlayer, getFoodListByPlayer } from "@/api/foodList_api";

export default function Index() {
  const [foodList, setFoodList] = useState([]);
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayerIdAndFood = async () => {
      try {
        const storedPlayerId = await AsyncStorage.getItem("PlayerId");

        if (storedPlayerId) {
          const parsedPlayerId = parseInt(storedPlayerId);
          setPlayerId(parsedPlayerId);
          console.log("✅ Player ID obtenido:", parsedPlayerId);

          fetchFoodList(parsedPlayerId);
        } else {
          console.error("❌ No se encontró playerId en AsyncStorage");
        }
      } catch (error) {
        console.error("❌ Error obteniendo el playerId del storage:", error);
      }
    };

    fetchPlayerIdAndFood();
  }, []);

  const fetchFoodList = async (id: number) => {
    try {
      console.log("🔹 Llamando API con playerId:", id);
      const response = await getFoodListByPlayer(id);

      if (response.status === 200) {
        console.log("✅ Lista de comida obtenida:", response.data.food_items);
        setFoodList(response.data.food_items);
      } else {
        console.error("❌ Error obteniendo la lista de comida:", response.data);
      }
    } catch (error) {
      console.error("❌ Error en la llamada a la API:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/green.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter color="0AFF99" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Pet />
        <HungerBar hungerLevel={100} width={60} />
      </View>

      {/* Barra de alimentos debajo de la mascota */}
      <FoodBar foodList={foodList} />
    </ImageBackground>
  );
}
