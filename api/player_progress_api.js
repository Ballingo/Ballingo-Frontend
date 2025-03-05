import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/player-progress/'
    }
);

export const setPlayerProgress = async (playerId, language, level) => {
    try {
        const res = await api.post('create_progress/', {
            player_id: playerId,
            language_code: language,
            level: level
        });
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data || "Error desconocido", status: error?.status || 500 };
    }
};