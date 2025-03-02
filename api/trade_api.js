import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
});


export const createTrade = async (tradeData) => {
    try {
        const res = await api.post("trade/", tradeData);

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};


export const getActiveTrades = async () => {
    try {
        const res = await api.get("trade/", { params: { isActive: true } });

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};

export const acceptTrade = async (tradeId, playerId) => {
    try {
        const res = await api.post(`trade/${tradeId}/accept/`, { player_id: playerId });

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};
