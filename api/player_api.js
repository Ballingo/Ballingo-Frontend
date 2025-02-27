import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const createPlayer = async (userId, inventoryIds, languageIds, actualLanguage) => {
    try{
        const res = await api.post('player', 
            {
                user: userId,
                language: inventoryIds,
                wardroveIds: languageIds,
                actualLanguage: actualLanguage
            }
        );

        return {data: res.data, status: res.status};
    }
    catch(err){
        const error = err.response
        return {data: error.data, status: error.status};
    }
};
