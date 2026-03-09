import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from './CartModal';

function Navbar({ user, logout, cartCount, cart, setCart }) {
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="container navbar-container">
                    <Link to="/" className="navbar-brand">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        GainForce
                    </Link>
                    <div className="nav-links">
                        <div
                            onClick={() => setShowCart(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', cursor: 'pointer', transition: 'all 0.2s', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                            className="nav-link-hover"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span className="badge badge-admin" style={{ padding: '0.1rem 0.4rem', minWidth: '1.25rem', textAlign: 'center' }}>{cartCount || 0}</span>
                        </div>
                        {!user ? (
                            <>
                                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Registrarse</Link>
                            </>
                        ) : (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/client'} className="nav-link">Perfil</Link>
                                <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                                    {user.username}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                                    Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showCart && (
                <CartModal
                    cart={cart}
                    onClose={() => setShowCart(false)}
                    setCart={setCart}
                    user={user}
                />
            )}
        </>
    );
}

export default Navbar;
