import axios from "axios";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/user/'
    }
);

export const createUser = (data) => {
    return res = api.post('signup', data);
};

export const loginUser = (data) => {
    return res = api.post('login', data);
};
