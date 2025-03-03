import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import Pet from "@/components/pet/Pet";
import HungerBar from "@/components/hunger-bar/HungerBar";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import { getUserById } from "../api/user_api";
import { getWardrobeByPlayer } from "../api/inventory_api";
import { getAllClothes } from "../api/clothes_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Clothes {
  id: number;
  type: string;
}

interface WardrobeItem {
  id: number;
  player: number;
}

interface Wardrobe {
  id: number;
  items: WardrobeItem[]; // Definir correctamente el tipo de items
  player: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [hatsCount, setHatsCount] = useState(0);
  const [accessoriesCount, setAccessoriesCount] = useState(0);
  const [totalHats, setTotalHats] = useState(0);
  const [totalAccessories, setTotalAccessories] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      const playerId = await AsyncStorage.getItem("PlayerId");  // Obtener el playerId
      console.log("Player ID:", playerId); // Verifica que estás obteniendo el PlayerId
      const id = await AsyncStorage.getItem("UserId");
      console.log("User ID:", id); // Verifica que estás obteniendo el UserId
      const token = await AsyncStorage.getItem("Token"); // Obtener el token desde AsyncStorage
  
      if (!playerId) {
        console.error("Player ID no encontrado en AsyncStorage");
        return; // Si no se encuentra el playerId, salimos de la función
      }

      const { data, status } = await getUserById(id, token);
  
      if (status === 200) {
        setUsername(data.username);
      }
  
      // Obtener el armario del usuario
      const wardrobeResponse = await getWardrobeByPlayer(playerId);
      if (wardrobeResponse.status === 200) {
        const wardrobe: Wardrobe = wardrobeResponse.data;
        console.log("Wardrobe del usuario:", wardrobe);

        // Acceder a la propiedad "items" de la respuesta
        const wardrobeItems = wardrobe.items || [];
        console.log("Items del armario:", wardrobeItems);

        // Obtener toda la ropa disponible
        const clothesResponse = await getAllClothes();
        if (clothesResponse.status === 200) {
          const allClothes: Clothes[] = clothesResponse.data;
          console.log("Toda la ropa disponible:", allClothes);

          // Contar sombreros y accesorios totales
          const totalHatsCount = allClothes.filter((item) => item.type === 'hat').length;
          const totalAccessoriesCount = allClothes.filter((item) => item.type === 'accesories').length;
          console.log("Total de sombreros:", totalHatsCount);
          console.log("Total de accesorios:", totalAccessoriesCount);

          // Contar sombreros y accesorios del usuario
          const userHatsCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find((clothes) => clothes.id === item.id);
            return clothesItem?.type === 'hat';
          }).length;

          const userAccessoriesCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find((clothes) => clothes.id === item.id);
            return clothesItem?.type === 'accesories';
          }).length;

          console.log("Sombreros del usuario:", userHatsCount);
          console.log("Accesorios del usuario:", userAccessoriesCount);

          setTotalHats(totalHatsCount);
          setTotalAccessories(totalAccessoriesCount);
          setHatsCount(userHatsCount);
          setAccessoriesCount(userAccessoriesCount);
        }
      } else {
        console.error("Error al obtener el armario:", wardrobeResponse);
      }
    };

    getUserData();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/backgrounds/cyan.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <MoneyCounter color="0AEFFF" />
        <View style={styles.header}>
          <Pet
            imageStyle={{
              width: 125,
              height: 125,
            }}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.username}>{username}</Text>
            <HungerBar hungerLevel={100} width={100} />
          </View>
        </View>
        
        
        <View style={styles.inventory}>
          <Text style={styles.inventoryText}>Hats: {hatsCount}/{totalHats}</Text>
          <Text style={styles.inventoryText}>Accessories: {accessoriesCount}/{totalAccessories}</Text>
        </View>

        <View style={styles.footer}>
          <Button title="Volver a Inicio" onPress={() => router.back()} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileDetails: {
    alignItems: "center",
    flexDirection: "column",
    maxWidth: "50%",
    flexShrink: 1,
  },
  header: {
    marginVertical: 75,
    marginHorizontal: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  inventory: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#0D93CF", 
    borderRadius: 15, 
    width: "80%",
    alignItems: "center",
    borderWidth: 2, 
    borderColor: "#00129A",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5, 
  },
  inventoryText: {
    fontSize: 18,
    color: "#FFF", 
    fontWeight: "600", 
    marginVertical: 5,
    textShadowColor: "#333",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
  },
});