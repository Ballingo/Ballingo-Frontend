import { getAllFood } from "@/api/food_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Router, useRouter } from "expo-router";

export const getCoinsNumber = (score: number): number => {
    return score * 5 ;
}

export const getFoodNumber = (score: number): number => {
    if (score == 0){
        return 0;
    }

    return Math.round(Math.random() * (score - 1) + 1);
};

export const getRandomFoodId = async (): Promise<any> => {
    const {data, status} = await getAllFood();

    if (status != 200){
        console.error("Error while fetching food data");
        return -1;
    }

    const index = Math.floor(Math.random() * (data.length - 1));
    console.log("Random index y data: ", index, data);
    return data[index];
};


export const checkForToken = async (router: Router) => {
    const token = await AsyncStorage.getItem("Token");

    if (!token || token === "") {
      router.replace("/sign-up");
    }
  };
