import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/players/'
});

export const getPlayerByUserId = async (userId) => {
    try {
        const res = await api.get(`by-user/${userId}/`);
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};

export const updatePlayerLanguage = async (playerId, newLanguage) => {
    try {
        const res = await api.put(`${playerId}/update_language/`, {
            actualLanguage: newLanguage
        });
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
}
