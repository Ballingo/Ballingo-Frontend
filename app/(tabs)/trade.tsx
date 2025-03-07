import { ImageBackground, View, Text } from "react-native";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import Inventory from "@/components/inventory/Inventory";
import Pet from "@/components/pet/Pet";
import { getFoodListByPlayer } from "@/api/foodList_api";
import { getAllFood } from "@/api/food_api";
import { FoodImageMap } from "@/utils/imageMap";
import { useFocusEffect } from "@react-navigation/native";

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

export default function Trade() {
  const [userFood, setUserFood] = useState<InventoryItem[]>([]);
  const [allFood, setAllFood] = useState<InventoryItem[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  useEffect(() => {
    const fetchPlayerIdAndFood = async () => {
      try {
        const storedPlayerId = await AsyncStorage.getItem("PlayerId");

        if (storedPlayerId) {
          const parsedPlayerId = parseInt(storedPlayerId);
          setPlayerId(parsedPlayerId);
          console.log("✅ Player ID obtenido:", parsedPlayerId);

          fetchUserFoodList(parsedPlayerId);
          fetchAllFoodList();
        } else {
          console.error("❌ No se encontró playerId en AsyncStorage");
        }
      } catch (error) {
        console.error("❌ Error obteniendo el playerId del storage:", error);
      }
    };

    fetchPlayerIdAndFood();
  }, []);

  const fetchUserFoodList = async (id: number) => {
    try {
      console.log("🔹 Llamando API con playerId:", id);
      const response = await getFoodListByPlayer(id);

      if (response.status === 200) {
        console.log("✅ Lista de comida obtenida:", response.data);

        const formattedFood = response.data.food_items
          .filter((item: any) => item.quantity > 0) // Filtrar comidas con cantidad > 0
          .map((item: any) => ({
            id: item.food.id.toString(),
            category: item.food.language,
            image: FoodImageMap[item.food.image_path], // Función para obtener la imagen
          }));

        console.log("📦 Comida formateada para userFood:", formattedFood);

        setUserFood(formattedFood);
      } else {
        console.error("❌ Error obteniendo la lista de comida:", response.data);
      }
    } catch (error) {
      console.error("❌ Error en la llamada a la API:", error);
    }
  };

  const fetchAllFoodList = async () => {
    try {
      const response = await getAllFood();

      if (response.status === 200) {
        const formattedFood = response.data.map((item: any) => ({
          id: item.id.toString(),
          category: item.language,
          image: FoodImageMap[item.image_path], // Función para obtener la imagen
        }));

        setAllFood(formattedFood);
      } else {
        console.error("❌ Error obteniendo la lista de comida:", response.data);
      }
    } catch (error) {
      console.error("❌ Error en la llamada a la API:", error);
    }
  };

  // Nuevo useEffect para imprimir la lista de comida una vez que se actualice food
  useEffect(() => {
    if (userFood.length > 0) {
      console.log("📦 Lista de comida seteada en el estado:", userFood);
    }
  }, [userFood]);

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/red.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter color="FF0000" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota e inventario */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 100,
        }}
      >
        <Pet
          containerStyle={{
            alignItems: "center",
            marginBottom: 20,
          }}
          imageStyle={{
            width: 200,
            height: 200,
          }}
        />

        {userFood.length > 0 ? (
          <Inventory
            categories={[
              { name: "es", image: require("../../assets/flags/es.svg") },
              { name: "en", image: require("../../assets/flags/en.svg") },
              { name: "de", image: require("../../assets/flags/de.svg") },
              { name: "ja", image: require("../../assets/flags/ja.svg") },
              { name: "ar", image: require("../../assets/flags/ar.svg") },
            ]}
            items={userFood}
            allItems={allFood}
            isClothes={false}
          />
        ) : (
          <Text>Cargando comida...</Text>
        )}
      </View>

      {/* Navbar al final */}
    </ImageBackground>
  );
}
