import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { createUser, confirmUser } from "../api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pet from "@/components/pet/Pet";
import Animated, {
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { getPlayerByUserId } from "@/api/player_api";
import { setPlayerWardrobe } from "@/api/inventory_api";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCodeSent, setIsCodeSent] = useState(false); // 🔹 Estado para cambiar la UI

  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      console.log("Reloading the screen...");
    }, [])
  );

  useEffect(() => {
    const checkForToken = async () => {
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        router.replace("/(tabs)");
      }
    };
    checkForToken();
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all the fields.",
      });
      return;
    }

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    setIsEmailValid(true);

    const newUser = { username, email, password };
    const { data, status } = await createUser(newUser);

    if (status === 201) {
      Toast.show({
        type: "success",
        text1: "Vrification code sent",
        text2: `Verification code sent to ${email}.`,
      });
      setIsCodeSent(true);
    }
    else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleConfirmUser = async () => {
    if (!verificationCode) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the verification code.",
      });
      return;
    }

    const { data, status } = await confirmUser(email, verificationCode);

    if (status === 201) {
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "Account created successfully.",
      });

      await AsyncStorage.setItem("Token", data.token);
      await AsyncStorage.setItem("UserId", data.user_id);

      const response = await getPlayerByUserId(data.user_id);
      if (response.status === 200) {
        const playerId = response.data.id;
        await AsyncStorage.setItem("PlayerId", playerId.toString());

        console.log("✅ Player data:", response.data);

        const clothesIds = [33, 34, 35];
        for (const clothesId of clothesIds) {
          const wardrobeResponse = await setPlayerWardrobe(playerId, clothesId);
          if (wardrobeResponse.status === 200) {
            console.log(`✅ Ropa con ID ${clothesId} asignada correctamente.`);
          } else {
            console.error(`❌ Error al asignar ropa con ID ${clothesId}:`, wardrobeResponse.data);
          }
        }
      } else {
        console.error("❌ Error obteniendo el jugador:", response.data);
      }

      router.replace("/(tabs)");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid verification code.",
      });
      console.error("❌ Error:", data);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backgrounds/space.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.delay(800).duration(800)}>
          <Pet imageStyle={{ width: 175, height: 175 }} type={""} />
        </Animated.View>

        <Animated.Text
          style={styles.title}
          entering={FadeInUp.delay(1000).duration(800)}
        >
          {isCodeSent ? "Enter Verification Code" : "Sign Up"}
        </Animated.Text>

        {!isCodeSent ? (
          <>
            <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: email === "" ? "#9f6cff" : isEmailValid ? "#6cff86" : "#ff6c6c" },
                ]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsEmailValid(validateEmail(text));
                }}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1600).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1800).duration(800)}>
              <TouchableOpacity
                style={[styles.button, animatedButtonStyle]}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
              <TouchableOpacity
                style={[styles.button, animatedButtonStyle]}
                onPress={handleConfirmUser}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <Animated.View entering={FadeInUp.delay(2000).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Already have an account? Log In here!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Toast 
        position="bottom"
        bottomOffset={20}
        onPress={() => Toast.hide()}
      />
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
  button: {
    padding: 10,
    backgroundColor: "#4e00dd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#F9F7F7", fontWeight: "bold" },
  linkContainer: { marginTop: 10, alignItems: "center" },
  linkText: { color: "#ba95ff", textDecorationLine: "underline" },
});
