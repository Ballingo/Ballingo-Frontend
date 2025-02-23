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

const { width } = Dimensions.get("window");

export default function Languages() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const languages = [
    {
      name: "English",
      flag: "en",
      image: require("../../assets/flags/en.svg"),
    },
    {
      name: "Spanish",
      flag: "es",
      image: require("../../assets/flags/es.svg"),
    },
    { name: "Arabic", flag: "ar", image: require("../../assets/flags/ar.svg") },
    { name: "German", flag: "de", image: require("../../assets/flags/de.svg") },
    {
      name: "Japanese",
      flag: "ja",
      image: require("../../assets/flags/ja.svg"),
    },
  ];

  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
    console.log(`Selected language: ${language}`);
  };

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    handleSelectLanguage(languages[index].name);
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/purple.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <MoneyCounter value={100} color="BE0AFF" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      <View style={styles.container}>
        <Text style={styles.title}>Select a Language</Text>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {languages.map((item, index) => (
              <TouchableOpacity
                key={item.flag}
                style={styles.flagContainer}
                onPress={() => handleSelectLanguage(item.name)}
              >
                <Image source={item.image} style={styles.flagImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedLanguage && (
          <Text style={styles.selectedText}>Selected: {selectedLanguage}</Text>
        )}

        <Button
          title="Confirm Selection"
          onPress={() => alert(`You selected ${selectedLanguage}`)}
        />
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
    color: "#333",
  },
  carouselContainer: {
    marginBottom: 20,
    width: "100%",
  },
  carousel: {
    alignItems: "center",
    justifyContent: "center",
  },
  flagContainer: {
    width: width, // Cada bandera ocupa el ancho completo de la pantalla
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
    color: "#0061FF",
  },
});
