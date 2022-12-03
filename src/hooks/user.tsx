import axios from 'axios';


const sLocalUser = localStorage.getItem("user");
const localUser = JSON.parse(sLocalUser)

const headerOpts = {
    headers: {
        'Authorization': `Bearer ${localUser?.apiToken}`
    }
}


export const fetchUser = async () => {
    const API = `${import.meta.env.VITE_BASE_URL}/users`

    const result = await axios.get(API, headerOpts)

    return result;
}

export const createUser = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users`

    const result = await axios.post(API, payload, headerOpts)

    return result;
}

export const updateUser = async (id, payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await axios.put(API, payload, headerOpts)

    return result;
}

export const deleteUser = async (id) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await axios.delete(API, headerOpts)

    return result;
}