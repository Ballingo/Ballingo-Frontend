import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import { useEffect } from "react";
import { getAllClothes } from "../../api/ballingo_api";

export default function Wardrobe() {
  useEffect(() => {
    console.log("Wardrobe screen mounted");

    async function loadAllClothes() {
      const res = await getAllClothes();
      console.log(res);
    }

    loadAllClothes();

  }, []);

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
        <Text>Wardrobe</Text>
      </View>


      {/* Navbar al final */}
    </ImageBackground>
  );
}
