import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { User, Product, Order } from '../types';

const TABS = ['Productos', 'Usuarios', 'Compras'];
const EMPTY_FORM = { name: '', price: 0, stock: 0, category: 'Suplementos', description: '', image: '' };
const CATEGORIES = ['Suplementos', 'Pastillas', 'Accesorios', 'Ropa'];

const SwalGF = Swal.mixin({
    background: '#27272a',
    color: '#f8fafc',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#3f3f46',
    iconColor: '#dc2626',
});

interface AdminDashboardProps {
    user: User;
}

function AdminDashboard({ user }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('Productos');

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>(EMPTY_FORM);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editImageMode, setEditImageMode] = useState<'url' | 'file'>('url');
    const [showNewForm, setShowNewForm] = useState(false);
    const [newForm, setNewForm] = useState<Partial<Product>>(EMPTY_FORM);
    const [newImageMode, setNewImageMode] = useState<'url' | 'file'>('url');

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => { fetchProducts(); fetchUsers(); fetchOrders(); }, []);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar los productos.' });
        } finally { setLoadingProducts(false); }
    };

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const handleEdit = (p: Product) => {
        setEditingId(p.id);
        setEditForm({ ...p });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editForm.name || !editForm.price || !editForm.stock || !editingId) {
            SwalGF.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Nombre, precio y stock son obligatorios.' });
            return;
        }

        try {
            const payload = {
                name: editForm.name,
                category: editForm.category,
                price: Number(editForm.price),
                stock: Number(editForm.stock),
                description: editForm.description,
                image: editForm.image
            };

            const data = await productService.update(editingId, payload);

            if (data) {
                setProducts(prev => prev.map(p => p.id === editingId ? data : p));
                setEditingId(null);
                setShowEditModal(false);
                SwalGF.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Producto actualizado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error('Error en handleUpdate:', err);
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo contactar con el servidor.' });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const result = await SwalGF.fire({
            icon: 'warning',
            title: '¿Eliminar producto?',
            text: `"${name}" será eliminado permanentemente.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            const success = await productService.delete(id);
            if (success) {
                setProducts(products.filter(p => p.id !== id));
                SwalGF.fire({ icon: 'success', title: 'Eliminado', text: 'Producto eliminado correctamente.', timer: 2000, showConfirmButton: false });
            }
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el producto.' });
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForm.name || !newForm.price || !newForm.stock) {
            SwalGF.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Nombre, precio y stock son obligatorios.' });
            return;
        }
        try {
            const created = await productService.create({ ...newForm, id: Date.now().toString(), price: Number(newForm.price), stock: Number(newForm.stock) });
            if (created) {
                setProducts([...products, created]);
                setNewForm(EMPTY_FORM);
                setShowNewForm(false);
                SwalGF.fire({ icon: 'success', title: '¡Producto creado!', text: `"${created.name}" fue agregado al inventario.`, timer: 2500, showConfirmButton: false });
            }
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el producto.' });
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar los usuarios.' });
        } finally { setLoadingUsers(false); }
    };

    const handleDeleteUser = async (id: string, fullName: string) => {
        const result = await SwalGF.fire({
            icon: 'warning',
            title: '¿Eliminar usuario?',
            text: `"${fullName}" será eliminado permanentemente.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            const success = await userService.delete(id);
            if (success) {
                setUsers(users.filter(u => u.id !== id));
                SwalGF.fire({ icon: 'success', title: 'Usuario eliminado', timer: 2000, showConfirmButton: false });
            }
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el usuario.' });
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch {
            SwalGF.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar las compras.' });
        } finally { setLoadingOrders(false); }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.85rem',
        backgroundColor: 'var(--surface-light)', border: '1px solid var(--border)',
        borderRadius: '0.25rem', color: 'var(--text-main)'
    };

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {showEditModal && (
                <div
                    onClick={() => setShowEditModal(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 200, padding: '1rem'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="card"
                        style={{ maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)' }}>Editar Producto</h3>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                        </div>

                        {editForm.image && (
                            <img src={editForm.image} alt={editForm.name}
                                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '1rem' }}
                            />
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Nombre *</label>
                                <input style={inputStyle} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Categoría</label>
                                <select style={inputStyle} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Precio en ₡ *</label>
                                <input style={inputStyle} type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Stock *</label>
                                <input style={inputStyle} type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Imagen</label>
                                <div style={{ display: 'flex', gap: 0, marginBottom: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', width: 'fit-content' }}>
                                    <button type="button"
                                        onClick={() => setEditImageMode('url')}
                                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer', backgroundColor: editImageMode === 'url' ? 'var(--primary)' : 'var(--surface-light)', color: editImageMode === 'url' ? '#fff' : 'var(--text-muted)' }}
                                    >URL</button>
                                    <button type="button"
                                        onClick={() => setEditImageMode('file')}
                                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer', backgroundColor: editImageMode === 'file' ? 'var(--primary)' : 'var(--surface-light)', color: editImageMode === 'file' ? '#fff' : 'var(--text-muted)' }}
                                    >📂 Archivo</button>
                                </div>
                                {editImageMode === 'url'
                                    ? <input style={inputStyle} value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} placeholder="https://... o /images/producto.jpg" />
                                    : <input type="file" accept="image/*" style={{ ...inputStyle, padding: '0.3rem' }}
                                        onChange={async e => {
                                            if (e.target.files && e.target.files[0]) {
                                                const b64 = await fileToBase64(e.target.files[0]);
                                                setEditForm({ ...editForm, image: b64 });
                                            }
                                        }}
                                    />
                                }
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Descripción</label>
                                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={handleUpdate} className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
                            <button onClick={() => setShowEditModal(false)} className="btn btn-outline">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8" style={{ marginTop: '1.5rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Mi Panel</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Bienvenido, {user.fullName}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to="/" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        🛍️ Ver Tienda
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.6rem 1.5rem', background: 'none', border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: activeTab === tab ? '600' : '400',
                            cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Productos' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 style={{ margin: 0 }}>Inventario ({products.length} productos)</h3>
                        <button onClick={() => setShowNewForm(!showNewForm)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                            {showNewForm ? 'Cancelar' : '+ Nuevo Producto'}
                        </button>
                    </div>

                    {showNewForm && (
                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Agregar Nuevo Producto</h4>
                            <form onSubmit={handleCreate}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Nombre *</label>
                                        <input style={inputStyle} value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} placeholder="Ej. Proteína Whey..." />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Categoría *</label>
                                        <select style={inputStyle} value={newForm.category} onChange={e => setNewForm({ ...newForm, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Precio en ₡ *</label>
                                        <input style={inputStyle} type="number" value={newForm.price} onChange={e => setNewForm({ ...newForm, price: Number(e.target.value) })} placeholder="Ej. 15000" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Stock *</label>
                                        <input style={inputStyle} type="number" value={newForm.stock} onChange={e => setNewForm({ ...newForm, stock: Number(e.target.value) })} placeholder="Ej. 50" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Imagen</label>
                                        <div style={{ display: 'flex', gap: 0, marginBottom: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', width: 'fit-content' }}>
                                            <button type="button" onClick={() => setNewImageMode('url')} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer', backgroundColor: newImageMode === 'url' ? 'var(--primary)' : 'var(--surface-light)', color: newImageMode === 'url' ? '#fff' : 'var(--text-muted)' }}>URL</button>
                                            <button type="button" onClick={() => setNewImageMode('file')} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer', backgroundColor: newImageMode === 'file' ? 'var(--primary)' : 'var(--surface-light)', color: newImageMode === 'file' ? '#fff' : 'var(--text-muted)' }}>📂 Archivo</button>
                                        </div>
                                        {newImageMode === 'url'
                                            ? <input style={inputStyle} value={newForm.image} onChange={e => setNewForm({ ...newForm, image: e.target.value })} placeholder="https://... o /images/producto.jpg" />
                                            : <>
                                                <input type="file" accept="image/*" style={{ ...inputStyle, padding: '0.3rem' }} onChange={async e => { if (e.target.files && e.target.files[0]) { const b64 = await fileToBase64(e.target.files[0]); setNewForm({ ...newForm, image: b64 }); } }} />
                                                {newForm.image && <img src={newForm.image} alt="preview" style={{ marginTop: '0.5rem', height: '80px', objectFit: 'cover', borderRadius: '0.25rem' }} />}
                                            </>
                                        }
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Descripción</label>
                                        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} placeholder="Descripción del producto..." />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Guardar Producto</button>
                                    <button type="button" onClick={() => { setShowNewForm(false); setNewForm(EMPTY_FORM); }} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loadingProducts ? <p style={{ color: 'var(--text-muted)' }}>Cargando...</p> : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio ₡</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td> {p.image ? <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} /> : <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--surface-light)', borderRadius: '0.25rem' }} />} </td>
                                            <td> <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{p.name}</span> </td>
                                            <td> <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>{p.category}</span> </td>
                                            <td>₡{Number(p.price).toLocaleString('es-CR')}</td>
                                            <td>{p.stock}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(p)} className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>Editar</button>
                                                    <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>Borrar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Usuarios' && (
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Usuarios Registrados ({users.length})</h3>
                    {loadingUsers ? <p style={{ color: 'var(--text-muted)' }}>Cargando...</p> : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Usuario</th>
                                        <th>Correo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{u.id}</td>
                                            <td style={{ fontWeight: '500' }}>{u.fullName}</td>
                                            <td>@{u.username}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                                            <td> {u.role !== 'admin' && ( <button onClick={() => handleDeleteUser(u.id, u.fullName)} className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}> Eliminar </button> )} </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Compras' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ventas Totales</span>
                            <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--primary)' }}>₡{orders.reduce((sum, o) => sum + Number(o.total), 0).toLocaleString('es-CR')}</h3>
                        </div>
                        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pedidos Realizados</span>
                            <h3 style={{ margin: '0.25rem 0 0 0' }}>{orders.length}</h3>
                        </div>
                    </div>
                    <h3 style={{ marginBottom: '1rem' }}>Historial de Compras ({orders.length})</h3>
                    {loadingOrders ? <p style={{ color: 'var(--text-muted)' }}>Cargando...</p> : orders.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No hay compras registradas aún.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Orden #</th>
                                        <th>Usuario</th>
                                        <th>Productos</th>
                                        <th>Total ₡</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{o.id}</td>
                                            <td style={{ fontWeight: '500' }}>{o.username || o.userId}</td>
                                            <td style={{ fontSize: '0.85rem' }}> {o.items?.map((item, i) => ( <span key={i}>{item.name} x{item.qty}{i < o.items.length - 1 ? ', ' : ''}</span> ))} </td>
                                            <td style={{ color: 'var(--primary)', fontWeight: '600' }}> ₡{Number(o.total).toLocaleString('es-CR')} </td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> {o.date ? new Date(o.date).toLocaleDateString('es-CR') : '-'} </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
