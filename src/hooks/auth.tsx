import axios from 'axios';

export const login = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/auth/login`
    const result = await axios.post(API, payload)

    return result;
}

export const register = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/auth/register`
    const result = await axios.post(API, payload)

    return result;
}

export const checkJWT = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/auth/verify-jwt`
    const result = await axios.post(API, payload)

    return result;
}
