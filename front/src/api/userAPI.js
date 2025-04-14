import axios from "axios"

const URL = 'http://localhost:3000'

export async function changeUsername(newUsername) {
    try {
        const res = await axios.patch(`${URL}/users/users`, { username: newUsername }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return false;
    }
}

export async function changePassword(currentPassword, newPassword) {
    try {
        const res = await axios.patch(`${URL}/users/users`, {
            password: currentPassword,
            newPassword: newPassword
        }, { withCredentials: true });
        return res.data;
    } catch (error) {
        if (error.response.status === 400)
            throw error.response.data.message;
    }
}

export async function fetchProfile() {
    try {
        const response = await axios.get(`${URL}/users/`, { withCredentials: true });

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function fetchUserData(dataType){
    try {
        const response = await axios.get(`${URL}/users/data/${dataType}`, { withCredentials: true });

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}