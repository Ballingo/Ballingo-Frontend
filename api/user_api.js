import axios from "axios";
import { DateTime } from "luxon";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/user/'
    }
);

export const createUser = async (data) => {
    try{
        const res = await api.post('signup', data);
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {
            data: {
                'emailError': error.data.email,
                'usernameError': error.data.username
            },
            status: error.status
        };
    }
};

export const loginUser = async (data) => {
    try{
        const res = await api.post('login', data);
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};

export const getUserById = async (userId, token) => {
    try{
        const res = await api.get(`get/${userId}`, 
            {
                headers: {'Authorization': `Token ${token}`}
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
}

export const getLastLogin = async (userId, token) => {
    try{
        const res = await api.get(`get/last-login/${userId}`, 
            {
                headers: {'Authorization': `Token ${token}`}
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};

export const setLastLogin = async (userId, token) => {
    try{
        const newLastLogin = DateTime.utc().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZ");

        const res = await api.put(`set/last-login/${userId}`,
            {
                last_login: newLastLogin
            },
            {
                headers: {'Authorization': `Token ${token}`}
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};

export const handleErrorUserSignUp = (error) => {
    if (error.emailError && error.usernameError){
        alert("Username and Email already exists");
    }
    if (error.usernameError && !error.emailError){
        alert("Username already exists");
    }
    if (error.emailError && !error.usernameError){
        alert("Email already exists");
    }
};

export const handleErrorUserLogin = (error) => {
    if (error.error){
        alert(`${error.error}`);
    }
};
