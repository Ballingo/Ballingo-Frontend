import axios from "axios";
import { DateTime } from "luxon";
import { getLastLogin, setLastLogin } from "./user_api"; 

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

export const getImagePathPetClothes = async (petId) => {
    try{
        const res = await api.get(`pet/${petId}/get_accesories_img`);
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

export const setIsDead = async (petId, isDead) => {
    try{
        const res = await api.put(`pet/${petId}/set_is_dead/`, {
            isDead: isDead,
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

export const increaseHunger = async (userId, petId, token) => {
    console.log(`🔍 Checking huner for user ${userId} and pet ${petId}`);
    try {

        const { data, status } = await getLastLogin(userId, token);
        const now = DateTime.utc();

        if (status !== 200) {
            return { data: "Could not get your last login", status };
        }

        const lastLogin = DateTime.fromISO(data.last_login, { zone: 'utc' });
        const diffHours = now.diff(lastLogin, 'hours').hours;

        if (diffHours <= 0) {
            return { data: "No time has passed, hunger remains the same", status: 200 };
        }

        const { data: hungerData, status: hungerStatus } = await getHungerBar(petId);

        if (hungerStatus !== 200) {
            return { data: "Could not get your pet's hunger bar", status: hungerStatus };
        }

        const hungerReductionRate = 2;
        let hungerFactor = Math.floor(diffHours * hungerReductionRate);

        const hungerResponse = await setHungerBar(petId, -hungerFactor);
        if (hungerResponse.status !== 200) {
            return { data: "Could not set your pet's hunger bar", status: hungerResponse.status };
        }
        console.log("✅ Hunger updated:", hungerResponse.data);

        const { data: lastLoginData, status: lastLoginStatus } = await setLastLogin(userId, token);
        if (lastLoginStatus !== 200) {
            return { data: "Could not update last login", status: lastLoginStatus };
        }

        return { data: lastLoginData, status: lastLoginStatus };

    } catch (err) {
        console.log("❌ Error:", err);
        const error = err.response;
        return { data: error?.data || "Unknown error", status: error?.status || 500 };
    }
};



export const playerHasPet = async (playerId, language) => {
    try {
        const res = await api.post(`pet/has_pet/`, {
            player_id: playerId,
            language_code: language
        });
        return { data: res.data, status: res.status };
    }
    catch (err) {
        const error = err.response;
        return { data: error.data, status: error.status };
    }
}