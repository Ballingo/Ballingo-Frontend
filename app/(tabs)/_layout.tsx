import { Tabs } from "expo-router";
import { ImageSourcePropType, Text, View, Animated, StyleSheet } from "react-native";
import React, { useRef, useEffect } from "react";



const icons = {
  shop: require("../../assets/icons/shop.png"),
  wardrobe: require("../../assets/icons/wardrobe.png"),
  home: require("../../assets/icons/home.png"),
  languages: require("../../assets/icons/languages.png"),
  trade: require("../../assets/icons/trade.png"),
};


const TabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      const animationLoop = () => {
        Animated.sequence([
          Animated.timing(animation, {
            toValue: -8,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (finished && focused) {
            animationLoop();
          }
        });
      };
      animationLoop();
    } else {
      animation.setValue(0);
    }
  }, [focused]);

  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Animated.Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, { transform: [{ translateY: animation }] }]}
      />
    </View>
  );
};


const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.navbar,
      }}
    >

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.shop} title="Shop" />
          ),
        }}
      />
      
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: "Wardrobe",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.wardrobe} title="Wardrobe" />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="languages"
        options={{
          title: "Languages",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.languages}
              title="Languages"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: "Trade",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.trade} title="Trade" />
          ),
        }}
      />
    </Tabs>
  );
};


const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    borderTopWidth: 2,
    borderTopColor: "#aaa",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  activeIconContainer: {
    backgroundColor: "#f0f0f0",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default TabsLayout;