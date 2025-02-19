import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import Pet from "@/components/pet/Pet";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import HungerBar from "@/components/hunger-bar/HungerBar";
import FoodBar from "@/components/food-bar/FoodBar";

export default function Shop() {
  return (
    <ImageBackground
      source={require("../../assets/backgrounds/notebook-bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter value={100} />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
      <View style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>

      <Text>Shop</Text>

      </View>


      {/* Navbar al final */}
    </ImageBackground>
  );
}
