import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const getQuestionnaire = async (questionnaireId) => {
    try{
        const res = await api.get(`questionnaire/${questionnaireId}`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};


export const getQuestionnairesByLanguage = async (languageCode) => {
    try {
        const res = await api.get(`questionnaire/by_language/`, {
            params: { language_code: languageCode },
        });

        return { data: res.data, status: res.status };
    } catch (err) {
        const error = err.response;
        return { data: error?.data, status: error?.status };
    }
};