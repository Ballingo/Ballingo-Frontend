import axios from "axios";
import { DateTime } from "luxon";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/user/'
    }
);

const pending = axios.create(
    {
        baseURL: 'http://localhost:8000/api/pending/'
    }
);

export const createUser = async (data) => {
    try{
        const res = await pending.post('registration', data);
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

export const confirmUser = async (email, code) => {
    try{
        const res = await pending.post('confirm-registration',
            {
                email: email,
                confirmation_code: code
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
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

export const logoutUser = async (token) => {
    try{
        const res = await api.post('logout', {},
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
        console.log("Setting last login for user: ", userId);
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

export const deleteUser = async (userId, token) => {
    try{
        const res = await api.delete(`delete/${userId}`,
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

export const getRecovCode = async (email) => {
    try{
        const res = await api.post(`get-recovery-code`, 
            {
                email: email
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};

export const resetPasswordRequest = async (email) => {
    try{
        const res = await api.post('reset-password/request',
            {
                email: email
            }
        );
        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};

export const resetPassword = async (email, newPass) => {
    try{
        const res = await api.put('confirm-new-password',
            {
                email: email,
                new_password: newPass
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
