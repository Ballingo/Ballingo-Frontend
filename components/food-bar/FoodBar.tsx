import React, { useRef, useState, useEffect } from "react";
import { View, Image, ScrollView, TouchableOpacity, Text } from "react-native";
import { reduceFoodQuantity } from "@/api/foodList_api";
import { getFoodById } from "@/api/food_api";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import styles from "./FoodBarStyles";
import { AntDesign } from "@expo/vector-icons";
import { FoodImageMap } from "@/utils/imageMap";
import { setHungerBar } from "@/api/pet_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FoodBarProps {
  foodList: { id: number; food: { image_path: string }; quantity: number }[];
  refreshFoodList: () => void;
}

const FoodBar: React.FC<FoodBarProps> = ({ foodList, refreshFoodList  }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [foods, setFoods] = useState(foodList);
  console.log("🔹 Lista de alimentos:", foodList);

  useEffect(() => {
    setFoods(foodList.filter((food) => food.quantity > 0));
  }, [foodList]);
  
  
  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleReduceQuantity = async (foodItemId: number, item: any) => {
    console.log("🔹 Reduciendo cantidad de alimento:", foodItemId);
    const response = await reduceFoodQuantity(foodItemId);
  
    if (response.status === 200) {
      const isFed = await FeedPet(item.food.id);
      if (isFed){

        setFoods((prevFoods) =>
          prevFoods
            .map((food) =>
              food.id === foodItemId ? { ...food, quantity: response.data.new_quantity } : food
            )
            .filter((food) => food.quantity > 0)
        );

        refreshFoodList();
      }
      else{
        console.error("❌ Could not feed your pet");
      }

    } 
    else {
      console.error("❌ Error reduciendo cantidad:", response.data);
    }
  };
  
  const FeedPet = async (foodId: number) => {
    const petId = await AsyncStorage.getItem("PetId");
    const {data, status} = await getFoodById(foodId);

    if (status === 200){
      if (petId){
        let isFed = await upDateFoodBar(petId, data.hunger_points);
        if (isFed){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        console.error("❌ Could not find your pet: ", data);
        return false;
      }
    }
    else{
      console.error("❌ Could not find food: ", data);
      return false;
    }

  };

  const upDateFoodBar = async (petId: string, hungerPoints: number) => {
    const {data, status} = await setHungerBar(petId, hungerPoints);

    if (status === 200){
      return true;
    }
    else{
      return false;
    }

  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={scrollLeft}>
        <AntDesign name="leftcircle" size={30} color="white" />
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {foods.map((food) => (
          <DraggableFood
            key={food.id}
            image={FoodImageMap[food.food.image_path]}
            quantity={food.quantity}
            onReduceQuantity={() => handleReduceQuantity(food.id, food)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.arrow} onPress={scrollRight}>
        <AntDesign name="rightcircle" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const DraggableFood: React.FC<{
  image: any;
  quantity: number;
  onReduceQuantity: () => void;
}> = ({ image, quantity, onReduceQuantity }) => {
  if (quantity <= 0) return null;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.8), withSpring(1));
    onReduceQuantity();
  };

  return (
    <GestureDetector gesture={gesture}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[styles.foodItem, animatedStyle]}>
          <Image source={image} style={styles.foodImage} />
          {quantity > 0 && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

export default FoodBar;
