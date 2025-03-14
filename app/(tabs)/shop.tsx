import { ImageBackground, View, FlatList, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import ShopItem from "@/components/shop-item/ShopItem";
import SliderButton from "@/components/slider-button/SliderButton";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllMoneyPacks, getAllClothesPacks, getShopItemById } from "@/api/shop_api";
import { setPlayerCoins, setPlayerLiveCounter, setPlayerWardrobe } from "@/api/inventory_api";
import { GameObjectImageMap, ClothesImageMap } from "@/utils/imageMap";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { checkForToken } from "@/utils/functions";
import Toast from "react-native-toast-message";

interface Products {
  id: string;
  price: string;
  name: string;
  description: string;
  image_path: any;
  category: string;
  rarity: string;
  items: any;
  clothes: any;
}

export default function Shop() {
  const [isObjects, setIsObjects] = useState(true);
  const [moneyItems, setMoneyItems] = useState<Products[]>([]);
  const [gameItems, setGameItems] = useState<Products[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      console.log("Relaoding the screen...");
      setIsObjects(true);
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const handleToggle = (isLeft: boolean) => {
    setIsObjects(isLeft);
  };

  useEffect(() => {

    const fetchMoneyItems = async () => {
      const {data, status} = await getAllMoneyPacks();

      if (status === 200) {
        setMoneyItems(data);
      }
      else{
        Toast.show({
          type: "Error",
          text1: `Fetching money offerts`,
        });
      }

    };

    const fetchGameItems = async () => {
      const {data, status} = await getAllClothesPacks();

      if (status === 200) {
        setGameItems(data);
      }
      else{
        Toast.show({
          type: "Error",
          text1: `Fetching clothes offerts`,
        });
      }

    };

    checkForToken(router);
    fetchMoneyItems();
    fetchGameItems();

  }, []);

  const handleBuy = async (idList: any, name: string, price: string) => {
    const playerId = await AsyncStorage.getItem("PlayerId");
    if (isObjects) {
      let coinAmount = 0;
      let livesAmount = 0;
      for (const id of idList) {
        const { data, status } = await getShopItemById(id);
  
        if (status === 200) {
          if (data.type === "lives"){
            livesAmount += data.lives_given;
          }
          else{
            coinAmount += data.coins_given;
          }
        }
        else{
          Toast.show({
            type: "Error",
            text1: `Error fetching item: ${id}`,
          });
        }
      }
  
      if (coinAmount > 0){
        const { data, status } = await setPlayerCoins(playerId, coinAmount);
  
        if (status === 200){
          Toast.show({
            type: "success",
            text1: `You bought ${coinAmount} coins`,
          });
          setRefreshKey((prev) => prev + 1);
        }
        else {
          Toast.show({
            type: "Error",
            text1: `Error buying coins`,
          });
        }
      }

      if (livesAmount > 0){
        const { data, status } = await setPlayerLiveCounter(playerId, livesAmount);
        
        if (status === 200){
          Toast.show({
            type: "success",
            text1: `You bought ${livesAmount} lives`,
          });
          setRefreshKey((prev) => prev + 1);
        }
        else {
          Toast.show({
            type: "Error",
            text1: `Error buying lives`,
          });
        }
      }

    }
    else {
      const {data, status} = await getShopItemById(idList[0]);
      if (status === 200){
        if (playerId){
          const transaction = await chargeCoins(playerId, price);
          if (transaction){
            updatePlayerWardrobe(playerId, data.clothes.id, name);
            setRefreshKey((prev) => prev + 1);
            setIsObjects(true);
          }
          else{
            Toast.show({
              type: "Error",
              text1: `Not enough coins`,
            });
          }
        }
        else{
          Toast.show({
            type: "Error",
            text1: `Error buying clothes`,
          });
        }
      }
    }
  };

  const updatePlayerWardrobe = async (playerId: string, clothesId: string, name: string) => {
    const { data, status } = await setPlayerWardrobe(playerId, clothesId);

    if (status === 200){
      Toast.show({
        type: "success",
        text1: `You bought ${name}`,
      });
    }
    else {
      Toast.show({
        type: "Error",
        text1: `Error transfering clothes to wardrobe`,
      });
    }

  };

  const chargeCoins = async (playerId: string, coins: string) => {
    let amoutToCharge = parseInt(coins) * -1;
    const { data, status } = await setPlayerCoins(playerId, amoutToCharge);

    if (status === 200){
      return true;
    }
    else {
      return false;
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/blue.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      key={refreshKey}
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
                image={isObjects ? GameObjectImageMap[item.image_path] : ClothesImageMap[item.items[0].clothes.image_path]}
                price={ isObjects ? item.price + "€" : item.price + " coins"}
                description={item.description}
                rarity={item.rarity}
                onPress={isObjects ? () => handleBuy(item.items, item.name, item.price) : () => handleBuy([item.items[0].id], item.name, item.price)}
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
