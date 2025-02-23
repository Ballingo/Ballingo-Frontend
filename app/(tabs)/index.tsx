import { ImageBackground, View } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import Pet from "@/components/pet/Pet";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import HungerBar from "@/components/hunger-bar/HungerBar";
import FoodBar from "@/components/food-bar/FoodBar";

export default function Index() {
  return (
    <ImageBackground
      source={require("../../assets/backgrounds/green.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter value={100} color="0AFF99" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Pet />
        <HungerBar hungerLevel={100} width={60} />
      </View>

      {/* Barra de alimentos debajo de la mascota */}
      <FoodBar />
    </ImageBackground>
  );
}
