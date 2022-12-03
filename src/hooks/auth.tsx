import axios from 'axios';

const sLocalUser = localStorage.getItem("user");
const localUser = JSON.parse(sLocalUser)

const headerOpts = {
    headers: {
        'Authorization': `Bearer ${localUser?.apiToken}`
    }
}


export const login = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/api/auth/login`
    const result = await axios.post(API, payload)

    return result;
}

export const register = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/api/auth/register`
    const result = await axios.post(API, payload)

    return result;
}

export const checkJWT = async (payload) => {
    headerOpts.headers.Authorization = `Bearer ${payload.jwt}`;
    const API = `${import.meta.env.VITE_BASE_URL}/api/auth/verify-jwt`
    const result = await axios.post(API, payload, headerOpts)

    return result;
}
