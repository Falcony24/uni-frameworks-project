import axios from "axios";

const URL = 'http://localhost:3000'

export async function getUpgrades() {
    try {
        const response = await axios.get(`${URL}/upgrades`);
        return response.data;
    } catch (error) {
        return false;
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
        const response = await axios.delete(`${URL}/upgrades/${id}`, {withCredentials: true });
        return true;
    } catch (error) {
        throw error;
    }
}