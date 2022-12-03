import axios from 'axios';

const sLocalUser = localStorage.getItem("user");
const localUser = JSON.parse(sLocalUser || "{}")
const userId = localUser?.id;

const headerOpts = {
    headers: {
        'Authorization': `Bearer ${localUser?.apiToken}`
    }
}

export const createOrder = async ({ event, ticket, totalPrice, quantity, status }) => {
    const today = new Date().toISOString();
    const orderData = {
        owner: userId,
        event: event,
        ticket: ticket,
        purchase_date: today,
        total_price: totalPrice,
        quantity,
        status: status || 0
    }
    const API = `${import.meta.env.VITE_BASE_URL}/api/orders`
    const result = await axios.post(API, orderData, headerOpts)

    return result;
}
