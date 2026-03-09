import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientProfile from './pages/ClientProfile';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product) => {
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
        <Routes>
          <Route path="/" element={<LandingPage addToCart={addToCart} user={user} />} />
          <Route path="/login" element={!user ? <LoginPage onLogin={login} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/client'} />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/client'} />} />

          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/client" element={user?.role === 'cliente' ? <ClientProfile user={user} /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
