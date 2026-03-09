import { useState, useEffect } from 'react';

function ClientProfile({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching user orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user.id]);

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', marginTop: '2rem', paddingBottom: '4rem' }}>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: 'var(--primary)',
                        fontWeight: '700'
                    }}>
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '0.25rem' }}>{user.fullName}</h2>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Nombre de Usuario</span>
                        <span style={{ fontWeight: '500', fontSize: '1.125rem' }}>@{user.username}</span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Correo Electrónico</span>
                        <span style={{ fontWeight: '500', fontSize: '1.125rem' }}>{user.email}</span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estado de Cuenta</span>
                        <span style={{ fontWeight: '500', fontSize: '1.125rem', color: '#10b981' }}>Activa</span>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Historial de Compras</h3>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Cargando tus pedidos...</p>
                    ) : orders.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface-light)', borderRadius: '0.5rem' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Aún no has realizado ninguna compra.</p>
                            <a href="/" style={{ color: 'var(--primary)', display: 'inline-block', marginTop: '1rem', textDecoration: 'none', fontWeight: 'bold' }}>🛒 Ir a la tienda</a>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '0.5rem', backgroundColor: 'var(--surface-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>ORDEN #{order.id}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem' }}>₡{order.total.toLocaleString()}</span>
                                            <span className="badge badge-cliente" style={{ fontSize: '0.65rem' }}>Entregado</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                                {item.qty}x {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientProfile;
