import axios from "axios";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const createPet = async (playerId, language, hunger, isDead) => {
    try{
        const res = await api.post('pet/', {
            player: parseInt(playerId),
            language: language,
            hunger: parseInt(hunger),
            isDead: isDead,
        });
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getPetClothes = async (petId) => {
    try{
        const res = await api.get(`pet/${petId}/get_accesories`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const addClothesToPet = async (petId, clothesId) => {
    try{
        const res = await api.put(`pet/${petId}/set_accesories/`, {
            accesories: parseInt(clothesId),
        });
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getHungerBar = async (petId) => {
    try{
        const res = await api.get(`pet/${petId}/get_hunger`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }   
};

export const setHungerBar = async (petId, hungerPoints) => {
    try{
        const res = await api.put(`pet/${petId}/set_hunger/`, {
            hunger: parseInt(hungerPoints),
        });
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getPetByPlayerAndLanguage = async (playerId, language) => {
    try {
        const res = await api.get(`pet/by-player/`, {
            params: { player_id: playerId, language: language }
        });
        return { data: res.data, status: res.status };
    } catch (err) {
        return { data: err.response?.data || "Error desconocido", status: err.response?.status || 500 };
    }
};
