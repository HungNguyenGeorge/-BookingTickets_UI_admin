import axios from 'axios';
import { useContext } from 'react';

export const getTicketsByEvent = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/tickets?event=${payload.eventId}`
    const result = await axios.get(API)

    return result;
}



export const createTicket = async ({ event, name, description, price, total_quantity, available_quantity }) => {
    const orderData = {
        event,
        name,
        description,
        price,
        total_quantity,
        available_quantity
    }
    const API = `${import.meta.env.VITE_BASE_URL}/tickets`
    const result = await axios.post(API, orderData)

    return result;
}
