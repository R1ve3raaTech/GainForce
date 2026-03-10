import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/AdminDashboard';
import ClientProfile from '../pages/ClientProfile';
import { User, Product } from '../types';

interface AppRoutesProps {
    user: User | null;
    login: (userData: User) => void;
    addToCart: (product: Product) => void;
}

function AppRoutes({ user, login, addToCart }: AppRoutesProps) {
    return (
        <Routes>
            <Route path="/" element={<LandingPage addToCart={addToCart} user={user} />} />
            <Route 
                path="/login" 
                element={!user ? <LoginPage onLogin={login} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/client'} />} 
            />
            <Route 
                path="/register" 
                element={!user ? <RegisterPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/client'} />} 
            />

            <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <AdminDashboard user={user!} /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/client" 
                element={user?.role === 'cliente' ? <ClientProfile user={user!} /> : <Navigate to="/login" />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
