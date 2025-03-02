import { ImageBackground, View, FlatList, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import ShopItem from "@/components/shop-item/ShopItem";
import SliderButton from "@/components/slider-button/SliderButton";
import { useState, useEffect } from "react";
import { getAllMoneyPacks, getAllClothesPacks } from "@/api/shop_api";

interface Products {
  id: string;
  price: string;
  name: string;
  description: string;
  image: any;
  category: string;
  rarity: string;
}

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
  const [moneyItems, setMoneyItems] = useState<Products[]>([]);
  const [gameItems, setGameItems] = useState<Products[]>([]);

  const handleToggle = (isLeft: boolean) => {
    setIsObjects(isLeft);
  };

  useEffect(() => {
    const fetchMoneyItems = async () => {
      const {data, status} = await getAllMoneyPacks();
      console.log("Money packs", data);

      if (status === 200) {
        setMoneyItems(data);
      }
      else{
        console.error(`${status} - ${data}`);
      }

    };

    const fetchGameItems = async () => {
      const {data, status} = await getAllClothesPacks();
      console.log("Clothes packs", data);

      if (status === 200) {
        setGameItems(data);
      }
      else{
        console.error(`${status} - ${data}`);
      }

    };

    fetchMoneyItems();
    fetchGameItems();

  }, []);

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/blue.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <MoneyCounter color="147DF5" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      <View style={{ flex: 1, marginTop: 100 }}>
        <SliderButton
          leftLabel={"Coins"}
          rightLabel={"Clothes"}
          onToggle={handleToggle}
        />
        {moneyItems.length > 0 && gameItems.length > 0 ? (
          <FlatList
            data={isObjects ? moneyItems : gameItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ShopItem
                title={item.name}
                image={item.image}
                price={ isObjects ? item.price + "€" : item.price + " coins"}
                description={item.description}
                rarity={"legendary"}
                onPress={() => alert(`Compraste ${item.name}`)}
              />
            )}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
          />
        ) : (
          <Text>Loading products...</Text>
        )}
      </View>
    </ImageBackground>
  );
}
