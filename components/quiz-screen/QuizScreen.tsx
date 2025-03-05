import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import styles from "./QuizScreenStyles";
import { getQuestionnaire } from "@/api/questionnaire_api";

// Lista de imágenes de comida disponibles
const foodImages = [
  require("../../assets/inventory/food/ja/sushi.png"),
  require("../../assets/inventory/food/es/squid_rings.png"),
];

const coinImage = require("../../assets/shop/coins.png");

const questions = [
  {
    id: 1,
    question: "¿Cuál es la capital de Francia?",
    options: ["Madrid", "París", "Berlín", "Londres"],
    correctAnswer: "París",
  },
  {
    id: 2,
    question: "¿Cuánto es 5 + 3?",
    options: ["5", "8", "12", "15"],
    correctAnswer: "8",
  },
];

const QuizScreen: React.FC = () => {
  const router = useRouter();
  const { level, questionnarie_id } = useLocalSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const progress = (currentQuestionIndex + 1) / questions.length;
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
    getQuestionnaire(questionnarie_id).then((data) => {
      console.log(data.data.questions);
    });
  }, []);


  // 👇 Se ejecuta SOLO cuando se completa el cuestionario
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestionIndex]); // 👈 Se ejecuta solo cuando `currentQuestionIndex` cambia

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nivel {level || "1"}</Text>
        <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />
      </View>

      {/* 🛑 Evita renderizar el cuestionario si ya terminó */}
      {currentQuestionIndex < questions.length && (
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.map((option) => (
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
            <Text style={styles.modalScore}>Puntaje: {score}/{questions.length}</Text>

            <View style={styles.rewardItem}>
              <Image source={foodImage} style={styles.rewardImage} />
              <Text style={styles.rewardText}>¡Conseguiste comida!</Text>
            </View>
            <View style={styles.rewardItem}>
              <Image source={coinImage} style={styles.rewardImage} />
              <Text style={styles.rewardText}>+10 Monedas</Text>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleBack}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default QuizScreen;
