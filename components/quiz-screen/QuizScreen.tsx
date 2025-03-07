import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import styles from "./QuizScreenStyles";
import { getQuestionnaire } from "@/api/questionnaire_api";
import { getCoinsNumber } from "@/utils/functions";
import { setCompletedLevel } from "@/api/player_progress_api";
import { setPlayerCoins } from "@/api/inventory_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPlayerProgress } from "@/api/player_progress_api";




// Lista de imágenes de comida disponibles
const foodImages = [
  require("../../assets/inventory/food/ja/sushi.png"),
  require("../../assets/inventory/food/es/squid_rings.png"),
];

const coinImage = require("../../assets/shop/coins.png");

const QuizScreen: React.FC = () => {
  const router = useRouter();

  const { levelData } = useLocalSearchParams();
  const parsedLevelData =
  typeof levelData === "string"
      ? JSON.parse(decodeURIComponent(levelData))
      : levelData; // Si ya es objeto, lo dejamos como está


  // 1) En lugar de un array fijo, manejamos el estado de las preguntas
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const progress = questions.length > 0 ? (currentQuestionIndex + 1) / questions.length : 0;
  const foodImage = foodImages[Math.floor(Math.random() * foodImages.length)];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/level-map");
    }
  };

  useEffect(() => {
    const fetchQuestionnaireById = async () => {
      const { data, status } = await getQuestionnaire(parsedLevelData?.id);

      if (status !== 200) {
        console.error("Error al obtener el cuestionario");
        return;
      }

      const transformedQuestions = data.questions.map((q: any) => {
        return {
          id: q.id,
          question: q.title,
          correctAnswer: q.answers[q.correct_answer],
          options: q.answers,
        };
      });

      setQuestions(transformedQuestions);
      
      console.log("Cuestionario completado: ", data);
    };

    fetchQuestionnaireById();
  }, [parsedLevelData?.id]);

  useEffect(() => {
    // Si ya pasamos la última pregunta, mostramos el modal
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestionIndex, questions, fadeAnim]);

  useEffect(() => {
    // Si el usuario terminó el cuestionario y obtuvo una puntuación perfecta
    if (modalVisible && score === questions.length) {
      console.log("✅ Usuario completó el nivel con puntuación perfecta. Marcando como completado...");
  
      if (parsedLevelData?.id) {
        // 1️⃣ Marcar el nivel como completado si aún no lo estaba
        if (!parsedLevelData?.completed) {
          setCompletedLevel(parsedLevelData?.id)
            .then(() => console.log(`✅ Nivel ${parsedLevelData?.id} marcado como completado.`))
            .catch((error) => console.error("❌ Error al marcar nivel como completado:", error));
        }
  
        // 2️⃣ Obtener monedas ganadas
        const coinsWon = getCoinsNumber(score);
  
        // 3️⃣ Si el nivel no estaba completado, otorgar monedas
        if (!parsedLevelData?.completed && coinsWon > 0) {
          (async () => {
            try {
              const playerId = await AsyncStorage.getItem("PlayerId");
              const selectedLanguage = await AsyncStorage.getItem("ActualLanguage");
        
              if (!playerId) {
                console.error("❌ No se encontró el PlayerId en AsyncStorage.");
                return;
              }
        
              if (!selectedLanguage) {
                console.error("❌ No se encontró el ActualLanguage en AsyncStorage.");
                return;
              }
        
              // 1️⃣ Otorgar monedas al jugador
              await setPlayerCoins(playerId, coinsWon);
              console.log(`💰 Se agregaron ${coinsWon} monedas al jugador ${playerId}.`);
        
              // 2️⃣ Actualizar el progreso del jugador al siguiente nivel
              await setPlayerProgress(playerId, selectedLanguage, parsedLevelData?.level + 1);
              console.log(`🚀 Se actualizó el progreso del jugador ${playerId} al nivel ${parsedLevelData?.level + 1}.`);
        
            } catch (error) {
              console.error("❌ Error al actualizar monedas o progreso:", error);
            }
          })();
        }
        
      } else {
        console.error("❌ No se encontró el ID del nivel.");
      }
    }
  }, [modalVisible, score, questions.length, parsedLevelData?.id]);
  
  

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedOption(null);
    setShowResult(false);
  };

  // 3) Renderizar dependiendo de si ya tenemos preguntas cargadas
  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Cargando preguntas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Level {parsedLevelData?.level || "1"}</Text>
        <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />
      </View>

      {/* Mostramos la pregunta si no hemos llegado al final */}
      {currentQuestionIndex < questions.length && (
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedOption === option
                    ? option === questions[currentQuestionIndex].correctAnswer
                      ? styles.correctAnswer
                      : styles.incorrectAnswer
                    : {},
                ]}
                onPress={() => handleAnswer(option)}
                disabled={showResult}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showResult && currentQuestionIndex < questions.length && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
          </Text>
        </TouchableOpacity>
      )}

      {/* POP-UP MODAL DE RECOMPENSAS */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>¡Has completado el cuestionario!</Text>
            <Text style={styles.modalScore}>
              Score: {score}/{questions.length}
            </Text>

            {/* Mostrar comida siempre */}
            <View style={styles.rewardItem}>
              <Image source={foodImage} style={styles.rewardImage} />
              <Text style={styles.rewardText}> You got food !</Text>
            </View>

            {/* Mostrar monedas solo si el cuestionario no está completado */}
            {!parsedLevelData?.completed && (
              <View style={styles.rewardItem}>
                <Image source={coinImage} style={styles.rewardImage} />
                <Text style={styles.rewardText}>+{getCoinsNumber(score)} Coins</Text>
              </View>
            )}

            <TouchableOpacity style={styles.modalButton} onPress={handleBack}>
              <Text style={styles.modalButtonText}>Accept</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default QuizScreen;
