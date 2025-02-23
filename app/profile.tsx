import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import Pet from "@/components/pet/Pet";
import HungerBar from "@/components/hunger-bar/HungerBar";
import MoneyCounter from "@/components/money-counter/MoneyCounter";

export default function ProfileScreen() {
  const router = useRouter();
  const username = localStorage.getItem("username");

  return (
    <View style={styles.container}>
      <MoneyCounter value={100} color="DEFF0A" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
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
    flex: 1,
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
