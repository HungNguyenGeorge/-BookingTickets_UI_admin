import axios from 'axios';

export const getAllEvents = async () => {
    const API = `${import.meta.env.VITE_BASE_URL}/events`
    const result = await axios.get(API)

    return result;
}

export const createEvent = async ({ name, slug, description, poster, startDate, endDate, published }) => {
    const orderData = {
        name,
        slug,
        description,
        poster,
        start_date: startDate,
        end_date: endDate,
        published
    }
    const API = `${import.meta.env.VITE_BASE_URL}/events`
    const result = await axios.post(API, orderData)

    return result;
}


export const updateEvent = async (id, payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/events/${id}`
    const result = await axios.put(API, payload)

    return result;
}


export const deleteEvent = async (id) => {
    const API = `${import.meta.env.VITE_BASE_URL}/events/${id}`
    const result = await axios.delete(API)

    return result;
}
