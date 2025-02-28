import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/' 
});


export const getAllFood= async () => {
    try {
        const res = await api.get(`food`);
        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};