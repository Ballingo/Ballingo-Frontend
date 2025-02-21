import { ImageBackground, View, FlatList } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import ShopItem from "@/components/shop-item/ShopItem";

const shopItems = [
  {
    id: "1",
    title: "Espada Mística",
    image: "../../assets/shop/coins.png",
    price: 1500,
    rarity: "epic",
  },
  {
    id: "2",
    title: "Poción de Vida",
    image: "../../assets/shop/coins.png",
    price: 500,
    rarity: "common",
  },
  {
    id: "3",
    title: "Arco del Dragón",
    image: "../../assets/shop/coins.png",
    price: 2000,
    rarity: "legendary",
  },
];

export default function Shop() {
  return (
    <ImageBackground
      source={require("../../assets/backgrounds/notebook-bg.png")}
      style={{ flex: 1, padding: 20 }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter value={10000} />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de la tienda */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <FlatList
          data={shopItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShopItem
              title={item.title}
              image={item.image}
              price={item.price}
              rarity={item.rarity}
              onPress={() => alert(`Compraste ${item.title}`)}
            />
          )}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </View>
    </ImageBackground>
  );
}
