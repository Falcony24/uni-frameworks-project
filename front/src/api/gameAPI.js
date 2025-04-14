import axios from "axios";

const URL = 'http://localhost:3000'

export async function getUpgrades() {
    try {
        const res = await axios.get(`${URL}/upgrades`);
        return res.data;
    } catch (error) {
        return false;
    }
}

export async function saveProgress(player) {
    try {
        const res = await axios.patch(`${URL}/users/players`, player, { withCredentials: true });
        return res.data;
    } catch (error){
        throw error;
    }
}