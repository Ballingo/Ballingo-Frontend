import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import styles from "./QuizScreenStyles";
import { getQuestionnaire } from "@/api/questionnaire_api";
import { getCoinsNumber, getFoodNumber, getRandomFoodId } from "@/utils/functions";
import { setCompletedLevel, getisCompleted } from "@/api/player_progress_api";
import { setPlayerCoins } from "@/api/inventory_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPlayerProgress } from "@/api/player_progress_api";
import { addFoodToPlayer } from "@/api/foodList_api"; 
import { FoodImageMap } from "@/utils/imageMap";

const coinImage = require("../../assets/shop/coins.png");

const QuizScreen: React.FC = () => {
  const router = useRouter();
  const { levelData } = useLocalSearchParams();
  const parsedLevelData = typeof levelData === "string"
      ? JSON.parse(decodeURIComponent(levelData))
      : levelData; 

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const progress = questions.length > 0 ? (currentQuestionIndex + 1) / questions.length : 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [foodObject, setFoodObject] = useState<any>(null);
  const [foodAmount, setFoodAmount] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

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

      const transformedQuestions = data.questions.map((q: any) => ({
        id: q.id,
        question: q.title,
        correctAnswer: q.answers[q.correct_answer],
        options: q.answers,
      }));

      setQuestions(transformedQuestions);
    };

    fetchQuestionnaireById();
  }, [parsedLevelData?.id]);

  useEffect(() => {
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
    if (modalVisible) {
      (async () => {
        try {
          const playerId = await AsyncStorage.getItem("PlayerId");
          const selectedLanguage = await AsyncStorage.getItem("ActualLanguage");
  
          if (!playerId || !selectedLanguage) {
            console.error("❌ No se encontró PlayerId o ActualLanguage en AsyncStorage.");
            return;
          }
  
          const {data, status} = await getisCompleted(parsedLevelData?.id);
          console.log("🔍 Comprobando si el nivel ya está completado:", data, status);

          // 🚨 Si el nivel ya está completado, no damos recompensas y salimos
          if (status === 200 && data.completed === true) {
            console.log("🎯 Nivel ya completado previamente. No se otorgan recompensas.");
            setAlreadyCompleted(true);
            return;
          }
  
          // 1️⃣ Obtener comida y monedas
          const foodObjectData = await getRandomFoodId();
          const calculatedFoodAmount = getFoodNumber(score);
          const coinsWon = getCoinsNumber(score);
  
          setFoodObject(foodObjectData);
          setFoodAmount(calculatedFoodAmount);
  
          console.log(`💰 Jugador ganó ${coinsWon} monedas y ${calculatedFoodAmount} comidas (${foodObjectData?.name}).`);
  
          // 2️⃣ Otorgar recompensas
          await setPlayerCoins(playerId, coinsWon);
          await addFoodToPlayer(playerId, foodObjectData.id, calculatedFoodAmount);
  
          // 3️⃣ Si el jugador obtuvo puntuación perfecta, se marca el nivel como completado
          if (score === questions.length) {
            await setCompletedLevel(parsedLevelData?.id);
            console.log(`✅ Nivel ${parsedLevelData?.id} marcado como completado.`);
            await setPlayerProgress(playerId, selectedLanguage, parsedLevelData?.level + 1);
          }
  
        } catch (error) {
          console.error("❌ Error al actualizar monedas o progreso:", error);
        }
      })();
    }
  }, [modalVisible, score]);  

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

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Level {parsedLevelData?.level || "1"}</Text>
        <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />
      </View>

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
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
          </Text>
        </TouchableOpacity>
      )}

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>You completed the questionnaire!</Text>
            <Text style={styles.modalScore}>
              Score: {score}/{questions.length}
            </Text>

            {score > 0 && foodObject && (
              <View style={styles.rewardItem}>
                <Image source={FoodImageMap[foodObject.image_path]} style={styles.rewardImage} />
                <Text style={styles.rewardText}>{`You got ${foodObject.name} x${foodAmount}`}</Text>
              </View>
            )}

            {!parsedLevelData?.completed && (
              <View style={styles.rewardItem}>
                {
                  alreadyCompleted
                    ? <Text style={styles.rewardText}>You already completed this level!</Text>
                    :
                    (
                      <>
                        <Image source={coinImage} style={styles.rewardImage} />
                        <Text style={styles.rewardText}>{`You got ${getCoinsNumber(score)} coins!`}</Text>
                      </>
                    )
                }
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
