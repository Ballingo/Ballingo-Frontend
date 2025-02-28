import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/' 
});

export const createFoodList = async (playerId) => {
    try {
        const res = await api.post('food-lists/', { player: playerId }); 
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};

export const getFoodListByPlayer = async (playerId) => {
    try {
        const res = await api.get(`food-list/${playerId}/`);
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};

export const reduceFoodQuantity = async (foodItemId) => {
    try {
        const res = await api.post("reduce-food/", { id: foodItemId });

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};
