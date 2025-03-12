import React, { useEffect } from "react";
import QuizScreen from "@/components/quiz-screen/QuizScreen"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "expo-router";
import { checkForToken } from "@/utils/functions";

export default function QuizPage() {
  const router = useRouter();

  useEffect(() => {
    checkForToken(router);
  }, []);

  return <QuizScreen />;
}