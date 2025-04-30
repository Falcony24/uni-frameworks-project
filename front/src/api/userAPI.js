import axios from "axios"

const URL = process.env.REACT_APP_API_URL;

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
        console.log(error);
        throw error;
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
        throw error;
    }
}