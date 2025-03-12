import { ImageBackground, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Importar AsyncStorage
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import Pet from "@/components/pet/Pet";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import HungerBar from "@/components/hunger-bar/HungerBar";
import FoodBar from "@/components/food-bar/FoodBar";
import { addFoodToPlayer, getFoodListByPlayer } from "@/api/foodList_api";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { increaseHunger } from "@/api/pet_api";

interface PlayerData {
  userId: string | null;
  token: string | null;
  playerId: string | null;
  petId: string | null;
}

export default function Index() {
  const [foodList, setFoodList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData>({
    userId: "",
    token: "",
    playerId: "",
    petId: ""
  });


  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
      petCheckHunger();
    }, [])
  );

  useEffect(() => {
    const fetchPlayerData = async () => {
      const uId = await AsyncStorage.getItem("UserId");
      const token = await AsyncStorage.getItem("Token");
      const pId = await AsyncStorage.getItem("PlayerId");
      const petId = await AsyncStorage.getItem("PetId");

      if (uId && token && pId) {
        setPlayerData({
          userId: uId,
          token: token,
          playerId: pId,
          petId: petId
        });
      }
      else{
        console.error("❌ Error getting player data from AsyncStorage");
      }
    };

    fetchPlayerData();
  }, []);

  const petCheckHunger = async () => {
    if (playerData.userId && playerData.playerId && playerData.token && playerData.petId) {
      const response = await increaseHunger(parseInt(playerData.userId), parseInt(playerData.playerId), parseInt(playerData.petId), playerData.token);
      if (response.status === 200) {
        console.log("Hunger increased");
        setRefreshKey((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const fetchPlayerIdAndFood = async () => {
      try {
        if (playerData.playerId) {
          const parsedPlayerId = parseInt(playerData.playerId);
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
  }, [playerData]);

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

  const refreshFoodList = () => {
    if (playerData.playerId) {
      fetchFoodList(parseInt(playerData.playerId));
      setRefreshKey((prev) => prev + 1);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/green.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter color="0AFF99" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Pet screen="index"/>
        
        {playerData.petId && playerData.petId !== "undefined" && <HungerBar width={60} />}

      </View>


      {/* Barra de alimentos debajo de la mascota */}
      <FoodBar foodList={foodList} refreshFoodList={refreshFoodList} />
    </ImageBackground>
  );
}
