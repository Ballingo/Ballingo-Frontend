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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
          Forgot your password?
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
          <Text style={styles.infoText}>
            Enter your email adress and we will send you instructions to reset
            your password
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1600).duration(800)}>
          <TouchableOpacity
            style={[styles.button, animatedButtonStyle]}
            onPress={() => {
              scale.value = withSpring(0.9, { damping: 2 }, () => {
                scale.value = withSpring(1);
              });
            }}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(2400).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Back to login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
  linkContainer: { marginTop: 10, alignItems: "center" },
  linkText: { color: "#ba95ff", textDecorationLine: "underline" },
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
  infoText: { color: "#ba95ff", marginBottom: 20, textAlign: "justify" },
  button: {
    padding: 10,
    backgroundColor: "#4e00dd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#F9F7F7", fontWeight: "bold" },
});
