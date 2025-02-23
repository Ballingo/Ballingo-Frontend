import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./ShopItemStyles";

const rarityColors: Record<string, string> = {
  common: "#9D9D9D",
  uncommon: "#2ECC71",
  rare: "#3498DB",
  epic: "#9B59B6",
  legendary: "#E67E22",
};

interface ShopItemProps {
  title: string;
  image: any;
  price: string;
  rarity: keyof typeof rarityColors;
  onPress: () => void;
}

const ShopItem: React.FC<ShopItemProps> = ({
  title,
  image,
  price,
  rarity,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor: rarityColors[rarity] }]}
    >
      <View style={styles.content}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShopItem;
