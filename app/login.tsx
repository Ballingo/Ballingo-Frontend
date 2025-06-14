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
import { loginUser, handleErrorUserLogin } from "../api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPlayerByUserId } from "../api/player_api";
import { getPetByPlayerAndLanguage } from "../api/pet_api";
import Animated, {
  withDelay,
  FadeIn,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeInDown,
  Easing,
  interpolate,
} from "react-native-reanimated";
import Pet from "@/components/pet/Pet";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const scale = useSharedValue(1);
  const petPositionX = useSharedValue(-100); // Inicia fuera de la pantalla a la izquierda
  const petPositionY = useSharedValue(0);

  const letters = "BALLINGO".split("");

  const letterColorValues = letters.map(() => useSharedValue(0));

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const petAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: petPositionX.value },
        { translateY: petPositionY.value },
      ],
    };
  });

  const handleLogin = async () => {
    if (username && password) {
      const credentials = { username, password };
      const { data, status } = await loginUser(credentials);

      if (status === 200) {
        await AsyncStorage.setItem("Token", data.token);
        await AsyncStorage.setItem("UserId", data.user_id);
        Toast.show({
          type: "success",
          text1: "Logged in",
          text2: "Welcome back! 👏",
        });

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
          router.replace("/(tabs)");
        } else {
          console.error("❌ Error obteniendo el jugador:", response.data);
        }
      } else {
        handleErrorUserLogin(data);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all the fields.",
      });
    }
  };

  React.useEffect(() => {
    // Animación de entrada del Pet
    petPositionX.value = withTiming(0, {
      duration: 10000,
      easing: Easing.out(Easing.exp),
    });
    petPositionY.value = withRepeat(
      withSpring(-20, { damping: 2, stiffness: 50 }),
      -1,
      true
    );
  }, []);

  return (
    <ImageBackground
      source={require("../assets/backgrounds/space.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      <View style={styles.ballingoContainer}>
        {letters.map((letter, index) => {
          const offset = useSharedValue(0);

          offset.value = withRepeat(
            withTiming(1, {
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
          );

          letterColorValues[index].value = withDelay(
            index * 400,
            withRepeat(
              withTiming(1, { duration: 6000, easing: Easing.linear }),
              -1,
              true
            )
          );

          const letterStyle = useAnimatedStyle(() => {
            const translateY = interpolate(offset.value, [0, 0], [0, -20], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const colorProgress = letterColorValues[index].value;

            const goldColors = [
              { r: 255, g: 225, b: 105 }, // Oro claro
              { r: 255, g: 195, b: 0 }, // Oro medio
              { r: 201, g: 152, b: 11 }, // Oro oscuro
              { r: 255, g: 225, b: 105 }, // Oro claro (para cerrar el ciclo)
            ];

            const colorIndex = Math.floor(
              colorProgress * (goldColors.length - 1)
            );
            const nextColorIndex = (colorIndex + 1) % goldColors.length;
            const blend = colorProgress * (goldColors.length - 1) - colorIndex;

            const r = Math.round(
              goldColors[colorIndex].r +
                blend *
                  (goldColors[nextColorIndex].r - goldColors[colorIndex].r)
            );
            const g = Math.round(
              goldColors[colorIndex].g +
                blend *
                  (goldColors[nextColorIndex].g - goldColors[colorIndex].g)
            );
            const b = Math.round(
              goldColors[colorIndex].b +
                blend *
                  (goldColors[nextColorIndex].b - goldColors[colorIndex].b)
            );

            return {
              transform: [{ translateY }],
              color: `rgb(${r}, ${g}, ${b})`,
              textShadowColor: `rgb(${r}, ${g}, ${b})`,
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 10,
            };
          });

          return (
            <Animated.Text
              key={index}
              style={[styles.ballingoLetter, letterStyle]}
              entering={FadeInDown.delay(300 + index * 200).duration(1000)}
            >
              {letter}
            </Animated.Text>
          );
        })}
      </View>
      <View style={styles.container}>
        <Animated.View style={petAnimatedStyle}>
          <Pet imageStyle={{ width: 175, height: 175 }} type={""} />
        </Animated.View>

        <Animated.Text
          style={styles.title}
          entering={FadeInUp.delay(800).duration(800)}
        >
          Log In
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
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
          <TouchableOpacity
            style={[styles.button, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
              });
              handleLogin();
            }}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(2200).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/sign-up")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              Don't have an account? Register here!
            </Text>
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
  ballingoContainer: {
    alignSelf: "center",
    position: "absolute",
    flexDirection: "row",
    marginTop: 120,
  },
  ballingoLetter: {
    fontSize: 56,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
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
