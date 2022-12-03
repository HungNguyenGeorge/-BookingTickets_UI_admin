import axios from 'axios';

export const fetchUniversity= async () => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/all`

    const result= await axios.get(API)

    return result;
}

export const createUniversity= async (payload) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university`

    const result= await axios.post(API, payload)

    return result;
}

export const updateUniversity= async (id, payload) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/${id}`

    const result= await axios.put(API, payload)

    return result;
}

export const deleteUniversity= async (id) => {
    const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/${id}`

    const result= await axios.delete(API)

    return result;
}