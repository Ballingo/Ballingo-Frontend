import { ImageBackground, View, FlatList } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import ShopItem from "@/components/shop-item/ShopItem";
import SliderButton from "@/components/slider-button/SliderButton";
import { useState } from "react";

const shopItems = [
  {
    id: "1",
    title: "Ultimate Coin Treasure",
    image: require("../../assets/shop/coins.png"),
    price: "20.99 $",
    rarity: "legendary",
  },
  {
    id: "2",
    title: "Mega Coin Chest",
    image: require("../../assets/shop/coins.png"),
    price: "15.99 $",
    rarity: "epic",
  },
  {
    id: "3",
    title: "Big Coin Bag",
    image: require("../../assets/shop/coins.png"),
    price: "9.99 $",
    rarity: "rare",
  },
  {
    id: "4",
    title: "Normal Coin Bag",
    image: require("../../assets/shop/coins.png"),
    price: "5.99 $",
    rarity: "uncommon",
  },
  {
    id: "5",
    title: "Some Coins I Guess...",
    image: require("../../assets/shop/coins.png"),
    price: "2.99 $",
    rarity: "common",
  },
];

const clothesItems = [
  {
    id: "1",
    title: "Cool Shirt",
    image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    price: "1000 coins",
    rarity: "uncommon",
  },
  {
    id: "2",
    title: "Adventurer Hat",
    image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    price: "800 coins",
    rarity: "rare",
  },
];

export default function Shop() {
  const [isObjects, setIsObjects] = useState(true);

  const handleToggle = (isLeft: boolean) => {
    setIsObjects(isLeft);
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/blue.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <MoneyCounter value={100} color="147DF5" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      <View style={{ flex: 1, marginTop: 100 }}>
        <SliderButton
          leftLabel={"Coins"}
          rightLabel={"Clothes"}
          onToggle={handleToggle}
        />
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
