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

const QuizScreen: React.FC = () => {
  const router = useRouter();
  const { level, questionnarie_id } = useLocalSearchParams();

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

  // 2) Cuando cargue el componente, hacemos la petición y mapeamos los datos
  useEffect(() => {
    const fetchQuestionnaireById = async () => {
      const { data, status } = await getQuestionnaire(questionnarie_id);
      console.log("Preguntas: ", data);

      if (status !== 200) {
        console.error("Error al obtener el cuestionario");
        return;
      }

      // data.questions es un array con objetos como:
      // {
      //   id: 3,
      //   title: 'General read air race.',
      //   correct_answer: 3,
      //   answers: Array(4) [...]
      // }
      // Ajustamos al formato que usamos en el Quiz:
      const transformedQuestions = data.questions.map((q: any) => {
        return {
          id: q.id,
          question: q.title,
          correctAnswer: q.answers[q.correct_answer],
          options: q.answers,
        };
      });

      setQuestions(transformedQuestions);
    };

    fetchQuestionnaireById();
  }, [questionnarie_id]);

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
        <Text style={styles.title}>Nivel {level || "1"}</Text>
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
              Puntaje: {score}/{questions.length}
            </Text>

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
