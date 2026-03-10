import { Order } from '../types';

const API_URL = 'http://127.0.0.1:3000/orders';

export const orderService = {
    getAll: async (): Promise<Order[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error fetching orders');
        return await res.json();
    },
    getByUserId: async (userId: string): Promise<Order[]> => {
        const res = await fetch(`${API_URL}?userId=${userId}`);
        if (!res.ok) throw new Error('Error fetching user orders');
        return await res.json();
    },
    create: async (orderData: Partial<Order>): Promise<Order> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!res.ok) throw new Error('Error creating order');
        return await res.json();
    }
};
