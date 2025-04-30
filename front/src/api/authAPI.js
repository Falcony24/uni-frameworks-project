import axios from "axios"

const URL = process.env.REACT_APP_API_URL;

export async function authenticateUser() {
    try {
        const response = await axios.get(`${URL}/auth/`, { withCredentials: true });
        return response.data.role;
    } catch (error) {
        throw error;
    }
}

export async function signUp(user) {
    try {
        const response = await axios.post(`${URL}/auth/signup`, user, { withCredentials: true });
        return response.status === 201
    }
    catch (error) {
        throw error
    }
}

export async function signIn(user) {
    try {
        const response = await axios.post(`${URL}/auth/signin`, user, { withCredentials: true });
        return response.status === 200;
    } catch (error) {
        throw error
    }
}

export async function signOut() {
    try {
        const res = await axios.post(`${URL}/auth/logout`, null, { withCredentials: true });
        return res.status === 200;
    } catch (error) {
        throw error
    }
}