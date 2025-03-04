import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Line } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import LevelPopup from "@/components/level-pop-up/LevelPopUp"; // Asegúrate de la ruta correcta
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

// Generar niveles dinámicamente
const levels = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  unlocked: i < 8, // Los primeros 8 niveles están desbloqueados
}));

// Disposición geométrica en zig-zag
const levelPositions = levels.map((_, index) => ({
  x: index % 2 === 0 ? 120 : 200,
  y: 2100 - index * 120,
}));

export default function LevelMap() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, []);

  const handleLevelPress = (level: number, unlocked: boolean) => {
    setSelectedLevel(level);
    setIsUnlocked(unlocked);
    setPopupVisible(true);
  };

  return (
    <ImageBackground style={styles.background} key={refreshKey}>
      {/* Botón para regresar a la pantalla de idiomas */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/languages")}
      >
        <Ionicons name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Volver a Languages</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          {/* Conectar niveles con líneas rectas */}
          <View style={styles.svgContainer}>
            <Svg width="100%" height="2200">
              {levelPositions.map((pos, index) => {
                if (index < levelPositions.length - 1) {
                  const nextPos = levelPositions[index + 1];
                  return (
                    <Line
                      key={`line-${index}`}
                      x1={pos.x + 30}
                      y1={pos.y + 30}
                      x2={nextPos.x + 30}
                      y2={nextPos.y + 30}
                      stroke="#FFD700"
                      strokeWidth={4}
                    />
                  );
                }
                return null;
              })}
            </Svg>
          </View>

          {/* Renderizar niveles */}
          {levels.map((level, index) => {
            const position = levelPositions[index];
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelButton,
                  {
                    left: position.x,
                    top: position.y,
                    backgroundColor: level.unlocked ? "#4CAF50" : "#D3D3D3",
                  },
                ]}
                onPress={() => handleLevelPress(level.id, level.unlocked)}
                disabled={!level.unlocked}
              >
                <Text style={styles.levelText}>{level.id}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Popup de nivel */}
      {selectedLevel !== null && (
        <LevelPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          level={selectedLevel}
          unlocked={isUnlocked}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  scrollContainer: { paddingVertical: 20, alignItems: "center" },
  mapContainer: { width: "100%", height: 2200, position: "relative" },
  svgContainer: { position: "absolute", width: "100%", height: "100%" },
  levelButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  levelText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});
