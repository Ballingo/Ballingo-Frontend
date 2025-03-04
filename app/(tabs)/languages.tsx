import React, { useState, useRef } from "react";
import {
  Button,
  Image,
  ImageBackground,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { createPet } from "@/api/pet_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function Languages() {

  const languages = [
    { name: "English", flag: "en", image: require("../../assets/flags/en.svg") },
    { name: "Spanish", flag: "es", image: require("../../assets/flags/es.svg") },
    { name: "Arabic", flag: "ar", image: require("../../assets/flags/ar.svg") },
    { name: "German", flag: "de", image: require("../../assets/flags/de.svg") },
    { name: "Japanese", flag: "ja", image: require("../../assets/flags/ja.svg") },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<any>(languages[0]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      let index = languages.indexOf(selectedLanguage);
      currentIndex === 0 ? scrollToIndex(0) : scrollToIndex(index);
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const handleSelectLanguage = (index: number) => {
    setCurrentIndex(index);
    setSelectedLanguage(languages[index]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < languages.length) {
      scrollToIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      scrollToIndex(prevIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    handleSelectLanguage(index);
  };

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    handleSelectLanguage(index);
  };

  const handleConfirmSelection = async () => {
    if (selectedLanguage) {
      console.log(`Selected language: ${selectedLanguage.name}`);

      const playerId = await AsyncStorage.getItem("PlayerId");
      const {data, status} = await createPet(playerId, selectedLanguage.flag, 100, false);

      if (status === 201) {
        console.log("Pet created", data);
        await AsyncStorage.setItem("PetId", data.id);
        
        router.push("../level-map");  // Lleva a la pantalla de niveles
      }
      else {
        console.error(`${status} - ${data}`);
      }

    } else {
      alert("Please select a language first.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/purple.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
    >
      <MoneyCounter color="BE0AFF" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      <View style={styles.container}>
        <Text style={styles.title}>Select a Language</Text>

        <View style={styles.carouselWrapper}>
          <TouchableOpacity
            style={styles.arrowLeft}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={[styles.arrowText, currentIndex === 0 && styles.disabled]}>‹</Text>
          </TouchableOpacity>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            style={{ width }}
          >
            {languages.map((item, index) => (
              <View key={item.flag} style={styles.flagContainer}>
                <Image source={item.image} style={styles.flagImage} />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.arrowRight}
            onPress={handleNext}
            disabled={currentIndex === languages.length - 1}
          >
            <Text style={[styles.arrowText, currentIndex === languages.length - 1 && styles.disabled]}>›</Text>
          </TouchableOpacity>
        </View>

        {selectedLanguage && (
          <Text style={styles.selectedText}>Selected: {selectedLanguage.name}</Text>
        )}

        <Button title="Confirm Selection" onPress={handleConfirmSelection} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  carouselWrapper: {
    position: "relative",
    width: width,
    height: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  flagContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  flagImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: "#FFFFFF",
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  disabled: {
    color: "#888888",
  },
});
