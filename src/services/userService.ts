import { User } from '../types';

const API_URL = 'http://127.0.0.1:3000/users';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error fetching users');
        return await res.json();
    },
    getById: async (id: string): Promise<User> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Error fetching user');
        return await res.json();
    },
    login: async (username: string, password: string): Promise<User | null> => {
        const res = await fetch(`${API_URL}?username=${username}&password=${password}`);
        if (!res.ok) throw new Error('Error logging in');
        const users = await res.json();
        return users.length > 0 ? users[0] : null;
    },
    register: async (userData: Partial<User>): Promise<User> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) throw new Error('Error registering user');
        return await res.json();
    },
    delete: async (id: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error deleting user');
        return true;
    }
};
