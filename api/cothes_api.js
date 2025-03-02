import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const getAllClothes = () => {
    return res = api.get('clothes/');
};

export const getClothesById = async (clothesId) => {
    try{
        const res = await api.get(`clothes/${clothesId}`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};
