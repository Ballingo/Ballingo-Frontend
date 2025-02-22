import { ImageBackground, View, FlatList } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import ShopItem from "@/components/shop-item/ShopItem";
import SliderButton from "@/components/slider-button/SliderButton";
import { useState } from "react";

const shopItems = [
  {
    id: "1",
    title: "Espada Mística",
    image: "../../assets/shop/coins.png",
    price: "15.99 $",
    rarity: "epic",
  },
  {
    id: "2",
    title: "Poción de Vida",
    image: "../../assets/shop/coins.png",
    price: "5.99 $",
    rarity: "common",
  },
  {
    id: "3",
    title: "Arco del Dragón",
    image: "../../assets/shop/coins.png",
    price: "20.99 $",
    rarity: "legendary",
  },
  {
    id: "4",
    title: "Poción de Vida",
    image: "../../assets/shop/coins.png",
    price: "5.99 $",
    rarity: "common",
  },
  {
    id: "5",
    title: "Poción de Vida",
    image: "../../assets/shop/coins.png",
    price: "5.99 $",
    rarity: "common",
  },
  {
    id: "6",
    title: "Poción de Vida",
    image: "../../assets/shop/coins.png",
    price: "5.99 $",
    rarity: "common",
  },
  {
    id: "7",
    title: "Arco del Dragón",
    image: "../../assets/shop/coins.png",
    price: "20.99 $",
    rarity: "legendary",
  },
];

const clothesItems = [
  { id: "1",
    title: "Camiseta Cool",
    image: "../../assets/shop/coins.png",
    price: "1000 coins",
    rarity: "uncommon" 
  },
  { id: "2",
    title: "Sombrero Aventurero",
    image: "../../assets/shop/coins.png",
    price: "800 coins",
    rarity: "rare" 
  },
]

export default function Shop() {
  const [isObjects, setIsObjects] = useState(true);

  const handleToggle = (isLeft: boolean) => {
    setIsObjects(isLeft);
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/notebook-bg.png")}
      style={{ flex: 1, padding: 20 }}
      resizeMode="cover"
    >
      <MoneyCounter value={10000} />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      <SliderButton leftLabel={"Objects"} rightLabel={"Clothes"} onToggle={handleToggle} />

      <View style={{ flex: 1, justifyContent: "center" }}>
        <FlatList
          data={isObjects ? shopItems : clothesItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShopItem
              title={item.title}
              image={item.image}
              price={item.price}
              rarity={item.rarity as any}
              onPress={() => alert(`Compraste ${item.title}`)}
            />
          )}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
        />
      </View>
    </ImageBackground>
  );
}
