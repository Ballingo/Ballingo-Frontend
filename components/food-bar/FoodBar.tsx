import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import styles from './FoodBarStyles';
import { AntDesign } from '@expo/vector-icons';

const initialFoods = [
  { id: 1, image: require('./assets/food1.png'), quantity: 3 },
  { id: 2, image: require('./assets/food2.png'), quantity: 5 },
  { id: 3, image: require('./assets/food3.png'), quantity: 2 },
  { id: 4, image: require('./assets/food4.png'), quantity: 4 },
  { id: 5, image: require('./assets/food5.png'), quantity: 1 },
  { id: 6, image: require('./assets/food6.png'), quantity: 6 },
  { id: 7, image: require('./assets/food7.png'), quantity: 2 },
];

const FoodBar: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [foods, setFoods] = useState(initialFoods);

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleReduceQuantity = (id: number) => {
    setFoods((prevFoods) =>
      prevFoods
        .map((food) =>
          food.id === id ? { ...food, quantity: food.quantity - 1 } : food
        )
        .filter((food) => food.quantity > 0)
    );
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
            image={food.image}
            quantity={food.quantity}
            onReduceQuantity={() => handleReduceQuantity(food.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.arrow} onPress={scrollRight}>
        <AntDesign name="rightcircle" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const DraggableFood: React.FC<{ image: any; quantity: number; onReduceQuantity: () => void }> = ({ image, quantity, onReduceQuantity }) => {
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
    scale.value = withSequence(
      withSpring(0.8),
      withSpring(1)
    );
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
