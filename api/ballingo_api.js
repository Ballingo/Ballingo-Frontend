import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const getAllClothes = () => {
    return res = api.get('clothes/');
};

export const createUser = (data) => {
    return res = api.post('user/signup', data);
};
