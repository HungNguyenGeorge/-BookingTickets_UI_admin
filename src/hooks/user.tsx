import axios from 'axios';

export const fetchUser= async () => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_USER}/student/all`

    const result= await axios.get(API)

    return result;
}

export const createUser= async (payload) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_USER}/student`

    const result= await axios.post(API, payload)

    return result;
}

export const updateUser= async (id, payload) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_USER}/student/${id}`

    const result= await axios.put(API, payload)

    return result;
}

export const deleteUser= async (id) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_USER}/student/${id}`

    const result= await axios.delete(API)

    return result;
}