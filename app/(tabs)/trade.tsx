import { ImageBackground, View, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import Inventory from "@/components/inventory/Inventory";
import Pet from "@/components/pet/Pet";
import { getFoodListByPlayer } from "@/api/foodList_api";
import imageMap from "@/utils/imageMap";

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

export default function Trade() {
  const [food, setFood] = useState<InventoryItem[]>([]);

  const mockAllFood: InventoryItem[] = [
    {
      id: "6",
      category: "de",
      image: require("../../assets/inventory/food/ja/food2.png"),
    },
    {
      id: "7",
      category: "ja",
      image: require("../../assets/inventory/food/ja/food2.png"),
    },
    {
      id: "8",
      category: "es",
      image: require("../../assets/inventory/food/ja/food2.png"),
    },
    {
      id: "9",
      category: "en",
      image: require("../../assets/inventory/food/ja/food2.png"),
    },
    {
      id: "10",
      category: "ar",
      image: require("../../assets/inventory/food/ja/food2.png"),
    },
  ];

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
        
        const formattedFood = response.data.food_items.map((item: any) => ({
          id: item.id.toString(),
          category: item.food.language,
          image: imageMap[item.food.image_path], // Función para obtener la imagen
        }));
  
        setFood(formattedFood);
      } else {
        console.error("❌ Error obteniendo la lista de comida:", response.data);
      }
    } catch (error) {
      console.error("❌ Error en la llamada a la API:", error);
    }
  };

  // Nuevo useEffect para imprimir la lista de comida una vez que se actualice food
  useEffect(() => {
    if (food.length > 0) {
      console.log("📦 Lista de comida seteada en el estado:", food);
    }
  }, [food]);

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/red.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter value={100} color="FF0000" />
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

        {food.length > 0 ? (
          <Inventory
            categories={["es", "en", "de", "ja", "ar"]}
            items={food}
            allItems={mockAllFood}
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
