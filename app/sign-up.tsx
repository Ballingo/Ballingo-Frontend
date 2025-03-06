import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { createUser, handleErrorUserSignUp } from "../api/user_api";
import { getPlayerByUserId } from "../api/player_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pet from "@/components/pet/Pet";
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  FadeInDown,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (username && email && password) {
      if (!validateEmail(email)) {
        setIsEmailValid(false);
        return;
      } else {
        setIsEmailValid(true);
      }

      const newUser = { username, email, password };
      const { data, status } = await createUser(newUser);

      if (status === 201) {
        alert(`Usuario ${username} registrado con éxito`);
        await AsyncStorage.setItem("Token", data.token);
        await AsyncStorage.setItem("UserId", data.user_id);

        const response = await getPlayerByUserId(data.user_id);

        if (response.status === 200) {
          await AsyncStorage.setItem("PlayerId", response.data.id);
          console.log("✅ Player data:", response.data);
        } else {
          console.error("❌ Error obteniendo el jugador:", response.data);
        }

        router.replace("/(tabs)");
      } else {
        handleErrorUserSignUp(data);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backgrounds/space.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(1000)}>
          <Pet imageStyle={{ width: 175, height: 175 }} type={""} />
        </Animated.View>

        <Animated.Text
          style={styles.title}
          entering={FadeInUp.delay(800).duration(800)}
        >
          Sign In
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(800).duration(800)}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000).duration(800)}>
          <TextInput
            style={[
              styles.input,
              { borderColor: isEmailValid ? "#6cff86" : "#ff6c6c" },
            ]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setIsEmailValid(validateEmail(text));
            }}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
          <TouchableOpacity
            style={[styles.button, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
              });
              handleRegister();
            }}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(2200).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              Already have an account? Log In here!
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#F9F7F7",
  },
  input: {
    height: 40,
    borderColor: "#9f6cff",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#000",
    backgroundColor: "#F9F7F7",
  },
  linkContainer: { marginTop: 10, alignItems: "center" },
  linkText: { color: "#ba95ff", textDecorationLine: "underline" },
  button: {
    padding: 10,
    backgroundColor: "#4e00dd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#F9F7F7", fontWeight: "bold" },
});
