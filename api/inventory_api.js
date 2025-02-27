import axios from "axios";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const createInventory = async (wardroveId, foodListId, coins = 100, lives = 3) => {
    try{
        const res = await api.post('inventory', 
            {
                clothes_inventory: wardroveId,
                food_inventory: foodListId,
                coins: coins,
                livesCounter: lives
            }
        );

        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};
