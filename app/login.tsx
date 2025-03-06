import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser, handleErrorUserLogin } from "../api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPlayerByUserId } from "../api/player_api";
import { getPetByPlayerAndLanguage } from "../api/pet_api";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (username && password) {
      const credentials = { username, password };
      const { data, status } = await loginUser(credentials);

      if (status === 200) {
        alert(`Bienvenido de nuevo, ${username}`);

        router.replace("/(tabs)");
        await AsyncStorage.setItem("Token", data.token);
        await AsyncStorage.setItem("UserId", data.user_id);

        const response = await getPlayerByUserId(data.user_id);

        if (response.status === 200) {
          await AsyncStorage.setItem("PlayerId", response.data.id);
          const petInfo = await getPetByPlayerAndLanguage(
            response.data.id,
            response.data.actualLanguage
          );
          await AsyncStorage.setItem("PetId", petInfo.data.id);
          await AsyncStorage.setItem(
            "ActualLanguage",
            response.data.actualLanguage
          );

          console.log("✅ Player data:", response.data);
        } else {
          console.error("❌ Error obteniendo el jugador:", response.data);
        }
      }

      handleErrorUserLogin(data);
    } else {
      alert("Por favor, ingresa tu usuario y contraseña.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => router.push("/sign-up")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  linkContainer: { marginTop: 10, alignItems: "center" },
  linkText: { color: "blue", textDecorationLine: "underline" },
});
