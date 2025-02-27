import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import Pet from "@/components/pet/Pet";
import HungerBar from "@/components/hunger-bar/HungerBar";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import { getUserById } from "../api/user_api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {

    const getUserData = async () => {
      const id = await AsyncStorage.getItem("UserId");
      const token = await AsyncStorage.getItem("Token");

      const { data, status } = await getUserById(id, token);

      if (status === 200){
        setUsername(data.username);
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
        <MoneyCounter value={100} color="0AEFFF" />
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
  header: {
    marginVertical: 75,
    marginHorizontal: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  profileDetails: {
    alignItems: "center",
    flexDirection: "column",
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
  },
});
