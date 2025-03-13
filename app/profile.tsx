import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
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
import { deleteUser, logoutUser } from "../api/user_api";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  items: WardrobeItem[];
  player: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log("Reloading the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const scale = useSharedValue(1);
  const [hatsCount, setHatsCount] = useState(0);
  const [accessoriesCount, setAccessoriesCount] = useState(0);
  const [totalHats, setTotalHats] = useState(0);
  const [totalAccessories, setTotalAccessories] = useState(0);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

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

          const totalHatsCount = allClothes.filter(
            (item) => item.type === "hat"
          ).length;
          const totalAccessoriesCount = allClothes.filter(
            (item) => item.type === "accesories"
          ).length;

          const userHatsCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find(
              (clothes) => clothes.id === item.id
            );
            return clothesItem?.type === "hat";
          }).length;

          const userAccessoriesCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find(
              (clothes) => clothes.id === item.id
            );
            return clothesItem?.type === "accesories";
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

  const handleDeleteUser = async () => {
    const userId = await AsyncStorage.getItem("UserId");
    const token = await AsyncStorage.getItem("Token");

    if (userId && token) {
      const { data, status } = await deleteUser(userId, token);

      if (status === 204) {
        await AsyncStorage.clear();
        console.log("Usuario eliminado correctamente");
        router.navigate("/");
      } else {
        console.error("Error al eliminar el usuario:", data);
      }
    }
  };

  const handleLogOut = async () => {
    const token = await AsyncStorage.getItem("Token");

    if (token) {
      const { data, status } = await logoutUser(token);

      if (status === 200) {
        await AsyncStorage.clear();
        console.log("User logged out");
        router.navigate("/");
      } else {
        console.error("Error logging out:", data);
      }
    }
  };

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
            <View style={styles.hungerBarContainer}>
              <HungerBar width={100} />
            </View>
          </View>
        </View>

        <View style={styles.inventory}>
          <Text style={styles.inventoryText}>
            Hats: {hatsCount}/{totalHats}
          </Text>
          <Text style={styles.inventoryText}>
            Accessories: {accessoriesCount}/{totalAccessories}
          </Text>
        </View>

        <View style={styles.buttonPanel}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
                handleDeleteUser();
              });
            }}
          >
            <Text style={styles.buttonText}>Delete account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
                handleLogOut();
              });
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
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
    flexDirection: "column",
    flex: 1,
    marginLeft: 10,
  },
  header: {
    marginVertical: 75,
    marginHorizontal: 20,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  hungerBarContainer: {
    width: "95%",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: "#5D11D4",
  },
  deleteButton: {
    backgroundColor: "#FF3232",
  },
  buttonPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
    marginVertical: 50,
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
  buttonText: { color: "#F9F7F7", fontWeight: "bold" },
});
