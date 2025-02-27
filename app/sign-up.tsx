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
import { createUser, handleErrorUserSignUp } from "../api/user_api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (username && email && password) {
      const newUser = { username, email, password };

      const {data, status} = await createUser(newUser);

      if (status === 201) {
        alert(`Usuario ${username} registrado con éxito`);

        router.replace("/(tabs)");
        await AsyncStorage.setItem("Token", data.token);
        await AsyncStorage.setItem("id", data.user_id);
      }

      handleErrorUserSignUp(data);

    }
    else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Registrarse" onPress={handleRegister} />

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Text>
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
