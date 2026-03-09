import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SwalGF = Swal.mixin({
    background: '#27272a',
    color: '#f8fafc',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3f3f46',
    iconColor: '#dc2626',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
});

const CATEGORIES = ['Todos', 'Suplementos', 'Pastillas', 'Accesorios', 'Ropa'];

function LandingPage({ addToCart, user }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [loginWarning, setLoginWarning] = useState(false);

    const handleAddToCart = (product) => {
        if (!user) {
            setLoginWarning(true);
            setTimeout(() => setLoginWarning(false), 3000);
            return;
        }
        addToCart(product);
        SwalGF.fire({
            icon: 'success',
            title: 'Agregado al carrito',
            text: `${product.name}`
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:3000/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = activeCategory === 'Todos'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <>
            {/* Hero Section */}
            <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '3rem 2rem', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '1rem' }}>
                        Bienvenido a GainForce Market
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Tu supermercado de suplementos de confianza. Encuentra la mejor selección de proteínas, creatinas y accesorios deportivos en un solo lugar.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>

                {/* Aviso de login requerido */}
                {loginWarning && (
                    <div style={{
                        position: 'fixed', top: '5rem', right: '1.5rem',
                        backgroundColor: 'var(--surface)', border: '1px solid var(--primary)',
                        borderLeft: '4px solid var(--primary)',
                        padding: '1rem 1.5rem', zIndex: 200, borderRadius: '0.25rem',
                        color: 'var(--text-main)', fontSize: '0.95rem', maxWidth: '300px'
                    }}>
                        ⚠️ Debes <strong><a href="/login" style={{ color: 'var(--primary)' }}>iniciar sesión</a></strong> para añadir productos al carrito.
                    </div>
                )}

                {/* Modal de detalle */}
                {selectedProduct && (
                    <div
                        onClick={() => setSelectedProduct(null)}
                        style={{
                            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 100, padding: '1rem'
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            className="card"
                            style={{ maxWidth: '480px', width: '100%' }}
                        >
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '1rem' }}
                            />
                            <span className="badge badge-cliente" style={{ marginBottom: '0.5rem' }}>{selectedProduct.category}</span>
                            <h2 style={{ marginTop: '0.5rem' }}>{selectedProduct.name}</h2>
                            <p style={{ marginBottom: '1rem' }}>{selectedProduct.description}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                ₡{Number(selectedProduct.price).toLocaleString('es-CR')}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Stock: {selectedProduct.stock} unidades
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    + Añadir al Carrito
                                </button>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="btn btn-outline"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>Tienda</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{filtered.length} productos</span>
                </div>

                {/* Filtros de categoría */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={activeCategory === cat ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Cargando productos...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {filtered.map(product => (
                            <div
                                key={product.id}
                                className="card"
                                style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '0.875rem' }}>
                                    <span className="badge" style={{ marginBottom: '0.4rem', fontSize: '0.65rem' }}>{product.category}</span>
                                    <h3 style={{ fontSize: '0.95rem', margin: '0.4rem 0 0.25rem 0', lineHeight: 1.3 }}>{product.name}</h3>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', margin: '0.4rem 0 0.75rem 0' }}>
                                        ₡{Number(product.price).toLocaleString('es-CR')}
                                    </p>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                                        className="btn btn-primary btn-block"
                                        style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                                    >
                                        + Añadir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default LandingPage;
