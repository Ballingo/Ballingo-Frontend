import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import Inventory from "@/components/inventory/Inventory";
import Pet from "@/components/pet/Pet";
import { useState } from "react";

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

const mockFood: InventoryItem[] = [
  { id: '1', category: 'de', image: require('../../assets/inventory/food/ja/food1.png') },
  { id: '2', category: 'ja', image: require('../../assets/inventory/food/ja/food1.png') },
  { id: '3', category: 'es', image: require('../../assets/inventory/food/ja/food1.png') },
  { id: '4', category: 'en', image: require('../../assets/inventory/food/ja/food1.png') },
  { id: '5', category: 'ar', image: require('../../assets/inventory/food/ja/food1.png') },
];

const mockAllFood: InventoryItem[] = [
  { id: '6', category: 'de', image: require('../../assets/inventory/food/ja/food2.png') },
  { id: '7', category: 'ja', image: require('../../assets/inventory/food/ja/food2.png') },
  { id: '8', category: 'es', image: require('../../assets/inventory/food/ja/food2.png') },
  { id: '9', category: 'en', image: require('../../assets/inventory/food/ja/food2.png') },
  { id: '10', category: 'ar', image: require('../../assets/inventory/food/ja/food2.png') },
];

export default function Trade() {

  const [food] = useState<InventoryItem[]>(mockFood);
  const [allFood] = useState<InventoryItem[]>(mockAllFood);

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
          categories={['es', 'en', 'de', 'ja', 'ar']}
          items={food}
          allItems = {allFood}
          isClothes={false}
        />

      </View>


      {/* Navbar al final */}
    </ImageBackground>
  );
}
