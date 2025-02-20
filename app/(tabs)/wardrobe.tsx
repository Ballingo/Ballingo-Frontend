import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import { useEffect } from "react";
import { getAllClothes } from "../../api/cothes_api";
import Pet from "@/components/pet/Pet";
import Inventory from "@/components/inventory/Inventory";
import { useState } from "react";


interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

const mockClothes: InventoryItem[] = [
  { id: '1', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '2', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '3', category: 'accesories', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '4', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '5', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '6', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '7', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '8', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '9', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '10', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '11', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '12', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '13', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '14', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '15', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '16', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '17', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '18', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '19', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '20', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '21', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
  { id: '22', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
];

export default function Wardrobe() {

  const [clothes] = useState<InventoryItem[]>(mockClothes);

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
        justifyContent: 'flex-start',
        marginTop: 100,
      }}>
        <Pet 
          containerStyle={{
            alignItems: 'center',
            marginBottom: 20,
          }}
          imageStyle={{
            width: 200,
            height: 200,
          }}
        />

        <Inventory 
          categories={['hats', 'shirts', 'shoes', 'accesories']}
          items={clothes}
        />
      </View>

      {/* Navbar al final */}
    </ImageBackground>
  );
}
