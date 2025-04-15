import axios from "axios";

const URL = 'http://localhost:3000';

export async function fetchUsers() {
    try {
        const response = await axios.get(`${URL}/admins`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        await axios.delete(`${URL}/admins/${userId}`, { withCredentials: true });
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}