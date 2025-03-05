import axios from "axios";

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
        const res = await api.get(`last_login/${userId}`, 
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
