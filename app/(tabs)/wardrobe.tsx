import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import { useEffect, useState, useCallback } from "react";
import { getWardrobeByPlayer } from "@/api/inventory_api";
import { ClothesImageMap } from "@/utils/imageMap";
import Pet from "@/components/pet/Pet";
import Inventory from "@/components/inventory/Inventory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { checkForToken } from "@/utils/functions";

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

export default function Wardrobe() {
  const [clothes, setClothes] = useState<InventoryItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    async function loadWardrobe() {
      try {
        const storedPlayerId = await AsyncStorage.getItem("PlayerId");

        if (!storedPlayerId) {
          console.error("❌ No se encontró playerId en AsyncStorage");
          return;
        }

        const parsedPlayerId = parseInt(storedPlayerId, 10);
        const response = await getWardrobeByPlayer(parsedPlayerId);

        if (response.status === 200 && Array.isArray(response.data.items)) {
          const formattedClothes = response.data.items.map((item: any) => {
            return {
              id: item.id.toString(),
              category: item.type || "unknown",
              image: ClothesImageMap[item.image_path],
            };
          });

          setClothes(formattedClothes);
        } else {
          console.error(
            "❌ Error al cargar wardrobe o datos incorrectos:",
            response.data
          );
        }
      } catch (error) {
        console.error("❌ Error en loadWardrobe:", error);
      }
    }

    checkForToken(router);
    loadWardrobe();
  }, []);

  useEffect(() => {
    if (clothes.length > 0) {
      console.log("📦 Wardrobe seteado en el estado:", clothes);
    }
  }, [clothes]);

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/orange.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter color="FF8700" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
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
          screen="inventory"
        />

        {clothes.length > 0 ? (
          <Inventory
            categories={[
              {
                name: "hat",
                image: require("../../assets/inventory/category/top-hat.png"),
              },
              {
                name: "eyes",
                image: require("../../assets/inventory/category/eyes.png"),
              },
              {
                name: "shoes",
                image: require("../../assets/inventory/category/boots.png"),
              },
              {
                name: "accesories",
                image: require("../../assets/inventory/category/ribbon.png"),
              },
            ]}
            items={clothes}
            isClothes={true}
            onClothesChange={handleRefresh}
          />
        ) : (
          <Text>Cargando ropa...</Text>
        )}
      </View>
    </ImageBackground>
  );
}
