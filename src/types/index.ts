export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    stock: number;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: 'admin' | 'cliente';
}

export interface CartItem extends Product {
    qty: number;
}

export interface Order {
    id: string;
    userId: string;
    username: string;
    items: CartItem[];
    total: number;
    date: string;
}
