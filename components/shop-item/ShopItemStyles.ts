import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    padding: 15,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: "yellow",
    fontWeight: "bold",
  },
});
