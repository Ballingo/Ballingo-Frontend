import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  progressBar: {
    width: "90%",
    height: 8,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  question: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#444",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    width: "80%",
    paddingVertical: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  optionText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  correctAnswer: {
    backgroundColor: "#4CAF50",
  },
  incorrectAnswer: {
    backgroundColor: "#D32F2F",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  rewardContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  rewardButton: {
    marginVertical: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FFD700",
    borderRadius: 8,
  },
  rewardButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#757575",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro transparente
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalScore: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rewardImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
