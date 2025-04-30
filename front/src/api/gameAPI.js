import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

export async function getUpgrades() {
    try {
        const response = await axios.get(`${URL}/upgrades`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function saveProgress(player) {
    try {
        const response = await axios.patch(`${URL}/users/players`, player, { withCredentials: true });
        return response.data;
    } catch (error){
        throw error;
    }
}

export async function createUpgrade(upgradeData) {
    try {
        const response = await axios.post(`${URL}/upgrades`, upgradeData, {withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUpgrade(id, upgradeData) {
    try {
        const response = await axios.put(`${URL}/upgrades/${id}`, upgradeData, {withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUpgrade(id) {
    try {
        return true;
    } catch (error) {
        throw error;
    }
}