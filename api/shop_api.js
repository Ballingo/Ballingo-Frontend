import axios from "axios";

const api = axios.create(
    {
        baseURL: 'http://localhost:8000/api/'
    }
);

export const getAllShopItems = async () => {
    try{
        const res = await api.get('shop-items');
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getShopItemById = async (itemId) => {
    try{
        const res = await api.get(`shop-items/${itemId}`);
        return { data: res.data, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getAllMoneyPacks = async () => {
    try{
        const res = await api.get('realPack');

        const rarityOrder = ["legendary", "epic", "rare", "uncommon", "common"];

        const sortedData = res.data.sort((a, b) => {
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        });

        return { data: sortedData, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};

export const getAllClothesPacks = async () => {
    try{
        const res = await api.get('gamePack');

        const rarityOrder = ["legendary", "epic", "rare", "uncommon", "common"];

        const sortedData = res.data.sort((a, b) => {
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        });

        return { data: sortedData, status: res.status };
    }
    catch(err){
        const error = err.response;
        return { data: error.data, status: error.status };
    }
};
