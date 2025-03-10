import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  petContainer: {
    position: "relative", // Permite que la gorra y la bola se animen juntas
  },

  image: {
    width: 256,
    height: 256,
  },

  accessory: {
    position: "absolute",
    resizeMode: "contain",
    zIndex: 10,
  },
  
});

export default styles;
