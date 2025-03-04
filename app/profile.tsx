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
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

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

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const [hatsCount, setHatsCount] = useState(0);
  const [accessoriesCount, setAccessoriesCount] = useState(0);
  const [totalHats, setTotalHats] = useState(0);
  const [totalAccessories, setTotalAccessories] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      const playerId = await AsyncStorage.getItem("PlayerId");  
      const id = await AsyncStorage.getItem("UserId");
      const token = await AsyncStorage.getItem("Token"); 
  
      if (!playerId) {
        return; 
      }

      const { data, status } = await getUserById(id, token);
  
      if (status === 200) {
        setUsername(data.username);
      }
  
      const wardrobeResponse = await getWardrobeByPlayer(playerId);
      if (wardrobeResponse.status === 200) {
        const wardrobe: Wardrobe = wardrobeResponse.data;
       
        const wardrobeItems = wardrobe.items || [];

        const clothesResponse = await getAllClothes();
        if (clothesResponse.status === 200) {
          const allClothes: Clothes[] = clothesResponse.data;

          const totalHatsCount = allClothes.filter((item) => item.type === 'hat').length;
          const totalAccessoriesCount = allClothes.filter((item) => item.type === 'accesories').length;
        
          const userHatsCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find((clothes) => clothes.id === item.id);
            return clothesItem?.type === 'hat';
          }).length;

          const userAccessoriesCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find((clothes) => clothes.id === item.id);
            return clothesItem?.type === 'accesories';
          }).length;

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
      key={refreshKey}
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
    backgroundColor: "#7DEFFF", 
    borderRadius: 15, 
    width: "80%",
    alignItems: "center",
    borderWidth: 2, 
    borderColor: "#7DB4FF",
    elevation: 5, 
  },
  inventoryText: {
    fontSize: 18,
    color: "#FFF", 
    fontWeight: "600", 
    marginVertical: 5,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
  },
});