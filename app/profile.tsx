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
  const [totalEyes, setTotalEyes] = useState(0);
  const [totalShoes, setTotalShoes] = useState(0);
  const [eyesCount, setEyesCount] = useState(0);
  const [shoesCount, setShoesCount] = useState(0);

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

          const totalEyesCount = allClothes.filter(
            (item) => item.type === "eyes"
          ).length;

          const totalShoesCount = allClothes.filter(
            (item) => item.type === "shoes"
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

          const userEyesCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find(
              (clothes) => clothes.id === item.id
            );
            return clothesItem?.type === "eyes";
          }).length;

          const userShoesCount = wardrobeItems.filter((item) => {
            const clothesItem = allClothes.find(
              (clothes) => clothes.id === item.id
            );
            return clothesItem?.type === "shoes";
          }).length;

          setTotalHats(totalHatsCount);
          setTotalAccessories(totalAccessoriesCount);
          setHatsCount(userHatsCount);
          setAccessoriesCount(userAccessoriesCount);
          setTotalEyes(totalEyesCount);
          setEyesCount(userEyesCount);
          setTotalShoes(totalShoesCount);
          setShoesCount(userShoesCount);
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
          <Text style={styles.inventoryTitle}>🎽 Your Wardrobe</Text>

          <View style={styles.inventoryRow}>
            <View style={styles.inventoryItem}>
              <Text style={styles.inventoryIcon}>🎩</Text>
              <Text style={styles.inventoryText}>
                {hatsCount}/{totalHats}
              </Text>
              <Text style={styles.inventoryLabel}>Hats</Text>
            </View>

            <View style={styles.inventoryItem}>
              <Text style={styles.inventoryIcon}>👀</Text>
              <Text style={styles.inventoryText}>
                {eyesCount}/{totalEyes}
              </Text>
              <Text style={styles.inventoryLabel}>Eyes</Text>
            </View>
          </View>

          <View style={styles.inventoryRow}>
            <View style={styles.inventoryItem}>
              <Text style={styles.inventoryIcon}>👟</Text>
              <Text style={styles.inventoryText}>
                {shoesCount}/{totalShoes}
              </Text>
              <Text style={styles.inventoryLabel}>Shoes</Text>
            </View>

            <View style={styles.inventoryItem}>
              <Text style={styles.inventoryIcon}>🕶</Text>
              <Text style={styles.inventoryText}>
                {accessoriesCount}/{totalAccessories}
              </Text>
              <Text style={styles.inventoryLabel}>Accessories</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
                handleLogOut();
              });
            }}
          >
            <Text style={styles.buttonText}>🚪 Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
                handleDeleteUser();
              });
            }}
          >
            <Text style={styles.buttonText}>🗑 Delete Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.backButton, animatedButtonStyle]}
          onPress={() => {
            scale.value = withSpring(0.9, { damping: 2 }, () => {
              scale.value = withSpring(1);
              router.back();
            });
          }}
        >
          <Text style={styles.backButtonText}>⬅ Back</Text>
        </TouchableOpacity>
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



  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#4A90E2", // Azul brillante
  },
  deleteButton: {
    backgroundColor: "#D0021B", // Rojo intenso
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },


  backButton: {
    marginTop: 30,
    paddingVertical: 14,
    width: "84%", // 🔹 Ahora es más ancho
    backgroundColor: "rgba(0, 174, 255, 0.9)", // 🔹 Más sólido, menos transparente
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2, // 🔹 Borde más grueso para resaltar
    borderColor: "#00D4FF", // 🔹 Azul brillante
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16, // 🔹 Texto más grande
    textTransform: "uppercase",
    letterSpacing: 1.2, // 🔹 Mejor separación de letras
  },
  


  inventory: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(0, 174, 255, 0.85)", // Azul semi-transparente
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  inventoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 5,
  },
  inventoryItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fondo semi-transparente
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  inventoryIcon: {
    fontSize: 30, // Tamaño más grande para el ícono
    marginBottom: 5,
  },
  inventoryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  inventoryLabel: {
    fontSize: 14,
    color: "#D0F0FF",
    marginTop: 5,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
  },
});
