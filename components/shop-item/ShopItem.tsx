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

const rarityBorderColors: Record<string, string> = {
  common: "#707070",
  uncommon: "#27AE60",
  rare: "#2980B9",
  epic: "#8E44AD",
  legendary: "#D35400",
};

interface ShopItemProps {
  title: string;
  image: any;
  price: string;
  description: string;
  rarity: keyof typeof rarityColors;
  onPress: () => void;
}

const ShopItem: React.FC<ShopItemProps> = ({
  title,
  image,
  price,
  description,
  rarity,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: rarityColors[rarity],
          borderColor: rarityBorderColors[rarity],
        },
      ]}
    >
      <View style={styles.content}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>{price} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShopItem;
