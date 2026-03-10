import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AppRoutes from './Routes/AppRoutes';
import { User, CartItem, Product } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Navbar user={user} logout={logout} cartCount={cartCount} cart={cart} setCart={setCart} />
      <main className="main-content">
        <AppRoutes user={user} login={login} addToCart={addToCart} />
      </main>
    </>
  );
}

export default App;
