import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "./LevelPopUpStyles";

interface LevelPopupProps {
  visible: boolean;
  onClose: () => void;
  level: number;
  unlocked: boolean;
}

const LevelPopup: React.FC<LevelPopupProps> = ({ visible, onClose, level, unlocked }) => {
  const router = useRouter();

  const handlePlay = () => {
    onClose();
    //router.push(`/quiz?level=${level}`); // Navega a la pantalla del cuestionario con el nivel
    router.push(`/quiz?level=${level}`);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.popupContainer}>
          <Text style={styles.title}>Nivel {level}</Text>
          <Text style={styles.description}>
            {unlocked
              ? "Este nivel está desbloqueado. ¿Quieres jugarlo?"
              : "Este nivel está bloqueado. Completa el anterior para desbloquearlo."}
          </Text>

          <View style={styles.buttonContainer}>
            {unlocked && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <Text style={styles.playButtonText}>Jugar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LevelPopup;
