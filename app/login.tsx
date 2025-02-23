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
import { loginUser } from "../api/user_api";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (username && password) {
      alert(`Bienvenido de nuevo, ${username}`);

      const credentials = { username, password };
      const res = await loginUser(credentials);
      console.log(res);

      router.replace("/(tabs)");
      localStorage.setItem("username", username);
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
