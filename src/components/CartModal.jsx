import Swal from 'sweetalert2';

const SwalGF = Swal.mixin({
    background: '#27272a',
    color: '#f8fafc',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3f3f46',
    iconColor: '#dc2626',
});

function CartModal({ cart, onClose, setCart, user }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const order = {
                id: Date.now().toString(),
                userId: user.id,
                username: user.username,
                items: cart,
                total: total,
                date: new Date().toISOString()
            };

            const res = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (res.ok) {
                setCart([]);
                onClose();
                SwalGF.fire({
                    icon: 'success',
                    title: '¡Compra Exitosa!',
                    text: 'Gracias por tu compra. Puedes ver los detalles en tu perfil.',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo procesar la compra.' });
            }
        } catch (error) {
            SwalGF.fire({ icon: 'error', title: 'Error de conexión', text: 'Asegúrate de que el servidor esté encendido.' });
        }
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, padding: '1rem'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="card"
                style={{ maxWidth: '450px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>Carrito de Compras</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Tu carrito está vacío.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>₡{item.price.toLocaleString('es-CR')} x {item.qty}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>₡{(item.price * item.qty).toLocaleString('es-CR')}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ color: 'var(--danger)', background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ borderTop: '2px solid var(--border)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Total:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₡{total.toLocaleString('es-CR')}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary btn-block"
                            style={{ padding: '0.75rem' }}
                        >
                            🛍️ Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartModal;
