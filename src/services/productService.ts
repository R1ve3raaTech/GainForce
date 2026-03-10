import { Product } from '../types';

const API_URL = 'http://127.0.0.1:3000/products';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error fetching products');
        return await res.json();
    },
    getById: async (id: string): Promise<Product> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Error fetching product');
        return await res.json();
    },
    create: async (product: Partial<Product>): Promise<Product> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Error creating product');
        return await res.json();
    },
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Error updating product');
        return await res.json();
    },
    delete: async (id: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error deleting product');
        return true;
    }
};
