import axios from "axios";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const addClothesToWardrobe = async (playerId, clothesId) => {
    try {
        const res = await api.post('inventory/add-clothes/', {
            player_id: playerId,
            clothes_id: clothesId
        });

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data || "Error desconocido", status: error?.status || 500 };
    }
};

export const getWardrobeByPlayer = async (playerId) => {
    try {
        const res = await api.get(`inventory/${playerId}/get-wardrobe/`);
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data || "Error desconocido", status: error?.status || 500 };
    }
};

export const getPlayerCoins = async (playerId) => {
    try{
        const res = await api.get(`inventory/${playerId}/get-coins`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const setPlayerCoins = async (playerId, amount) => {
    try{
        const res = await api.put(`inventory/${playerId}/update-coins/`, 
            {
                coins: parseInt(amount)
            }
        );
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getPlayerLiveCounter = async (playerId) => {
    try{
        const res = await api.get(`inventory/get-lives/${playerId}/`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const setPlayerLiveCounter = async (playerId, amount) => {
    try{
        const res = await api.put(`inventory/set-lives/${playerId}/`, 
            {
                lives_counter: parseInt(amount)
            }
        );
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const setPlayerWardrobe = async (playerId, clothesId) => {
    try{
        const res = await api.put(`inventory/set-wardrobe/${playerId}/`, 
            {
                clothes_id: clothesId
            }
        );
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
}
