import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

export async function fetchUsers() {
    try {
        const response = await axios.get(`${URL}/admins`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        await axios.delete(`${URL}/admins/${userId}`, { withCredentials: true });
        return true;
    } catch (error) {
        throw error;
    }
}