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

export const getPlayerProgress = async (playerId, language) => {
    try {
        const res = await api.get('get_progress/', {
            params: {
                player_id: playerId,
                language_code: language
            }
        });
        return { data: res.data, status: res.status };
    }
    catch (err) {
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getUserLevels = async (playerId, language) => {
    try {
        const res = await api.post(`get_user_levels/`, {
            player_id: playerId,
            language_code: language,
        });
        return res.data || [];
    } catch (err) {
        const error = err.response;
        return { data: error?.data || "Error desconocido", status: error?.status || 500 };
    }
}

export const setCompletedLevel = async (questionnaireId) => {
    try {
        const res = await api.put('set_completed/', {
            questionnaire_id: questionnaireId
        });
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data || "Error desconocido", status: error?.status || 500 };
    }
}
