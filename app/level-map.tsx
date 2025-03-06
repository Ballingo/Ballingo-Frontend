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
import { getUserLevels } from "@/api/player_progress_api"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuestionnairesByLanguage } from "@/api/questionnaire_api";


// Disposición geométrica en zig-zag (reducido a 5 niveles)
const levelPositions = [
  { x: 75, y: 800 },  // Nivel 1
  { x: 275, y: 650 },  // Nivel 2
  { x: 75, y: 500 },  // Nivel 3
  { x: 350, y: 350 },  // Nivel 4
  { x: 75, y: 200 },  // Nivel 5
];





export default function LevelMap() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [levels, setLevels] = useState<any[]>([]);
  const [levelObject, setLevelObject] = useState<any>(null);


  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: levelPositions[0].y, animated: true });
    }, 1000);
  }, []);


  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const playerId = await AsyncStorage.getItem("PlayerId");
        const language = await AsyncStorage.getItem("ActualLanguage");

        if (!playerId || !language) {
          console.error("No se encontró el PlayerId o ActualLanguage");
          return;
        }
        
        
        const levelsData = await getQuestionnairesByLanguage(language);
        console.log("Datos de TODOS los niveles:", levelsData.data);

        const userLevels = await getUserLevels(playerId, language);
        console.log("Datos de niveles del usuario:", userLevels);

        const N = userLevels.length;


        // 🔹 Asegúrate de que levelsData es un array antes de hacer .map()
        if (!Array.isArray(levelsData.data)) {
          console.error("Error: los datos recibidos no son un array", levelsData);
          return;
        }

        const formattedLevels = levelsData.data.map((level, index) => ({
          ...level,
          unlocked: index < N, // Solo los primeros N niveles estarán desbloqueados
        }));
  
        setLevels(formattedLevels);

        console.log("Niveles formateados:", levels); 
      } catch (error) {
        console.error("Error obteniendo los niveles:", error);
      }
    };

    fetchLevels();
  }, [refreshKey]);



  const handleLevelPress = (levelObject: any) => {
    console.log("Este es el objeto", levelObject);
    setSelectedLevel(levelObject.level);
    setPopupVisible(true);
    setLevelObject(levelObject);
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
                onPress={() => handleLevelPress(level)}
                disabled={!level.unlocked}
              >
                <Text style={styles.levelText}>{level.level}</Text>
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
          levelObject= {levelObject}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  scrollContainer: { paddingVertical: 20, alignItems: "center" },

  mapContainer: { 
    width: "100%", 
    height: levelPositions[0].y + 200, 
    position: "relative" 
  },
  
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
