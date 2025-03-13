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
import Animated, {
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import Pet from "@/components/pet/Pet";
import { resetPasswordRequest, getRecovCode, resetPassword } from "../api/user_api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleResetPassRequest = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const { data, status } = await resetPasswordRequest(email);

    if (status === 200) {
      console.log("Email sent successfully");
      console.log("Generated verification code:", data.verificationCode);
      setIsEmailSent(true);
    } else {
      alert("Email not found");
      console.error("Error sending email");
      console.error(data);
    }
  };

  const handleRecovCode = async () => {
    if (!verificationCode) {
      alert("Please enter the verification code");
      return;
    }

    const { data, status } = await getRecovCode(email);

    if (status === 200) {
      if (verificationCode === data.recovery_code) {
        setIsCodeCorrect(true);
        console.log("Verification code is correct");
      } else {
        alert("Verification code is incorrect");
      }
    } else {
      alert("Verification code is incorrect");
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { data, status } = await resetPassword(email, newPassword);

    if (status !== 200) {
      alert("Error resetting password");
      console.error(data);
      return
    }

    console.log("Password reset successfully");
    alert("Your password has been reset");

    router.push("/login");
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
          {!isEmailSent
            ? "Forgot your password?"
            : isCodeCorrect
            ? "Reset your password"
            : "Enter the verification code"}
        </Animated.Text>

        {!isEmailSent ? (
          <>
            <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
              <Text style={styles.infoText}>
                Enter your email address and we will send you instructions to
                reset your password.
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
                    handleResetPassRequest();
                  });
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : !isCodeCorrect ? (
          <>
            <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
              <Text style={styles.infoText}>
                We have sent you a verification code. Please enter it below.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1600).duration(800)}>
              <TouchableOpacity
                style={[styles.button, animatedButtonStyle]}
                onPress={handleRecovCode}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1400).duration(800)}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1600).duration(800)}>
              <TouchableOpacity
                style={[styles.button, animatedButtonStyle]}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <Animated.View entering={FadeInUp.delay(1800).duration(800)}>
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
  linkContainer: { marginTop: 10, alignItems: "center" },
  linkText: { color: "#ba95ff", textDecorationLine: "underline" },
});
