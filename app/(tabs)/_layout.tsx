import { Tabs } from "expo-router";
import {
  ImageSourcePropType,
  Text,
  View,
  Animated,
  StyleSheet,
} from "react-native";
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
  index,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  index: number;
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
        style={[styles.icon, { transform: [{ translateY: animation }] }]}
      />
    </View>
  );
};

const TabsLayout = () => {
  const tabData = [
    { name: "shop", icon: icons.shop },
    { name: "wardrobe", icon: icons.wardrobe },
    { name: "index", icon: icons.home },
    { name: "languages", icon: icons.languages },
    { name: "trade", icon: icons.trade },
  ];

  return (
    <Tabs
      screenOptions={{ tabBarShowLabel: false, tabBarStyle: styles.navbar }}
    >
      {tabData.map((tab, i) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.name.charAt(0).toUpperCase() + tab.name.slice(1),
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} index={i} />
            ),
          }}
        />
      ))}
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
    borderTopWidth: 2,
    borderTopColor: "#aaa",
    height: 80,
    flex: 1,
  },
  iconContainer: {
    height: 78,
    paddingInline: 15,
    justifyContent: "center",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#ccc",
  },
  activeIconContainer: {
    backgroundColor: "#f0f0f0",
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default TabsLayout;
