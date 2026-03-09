import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'cliente'
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
            setError('Por favor complete todos los campos');
            return;
        }

        setLoading(true);
        try {
            // Check if username already exists
            const checkRes = await fetch(`http://localhost:3000/users?username=${formData.username}`);
            const existingUser = await checkRes.json();

            if (existingUser.length > 0) {
                setError('El nombre de usuario ya está en uso');
                setLoading(false);
                return;
            }

            // Create user
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id: Date.now().toString() })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Error al registrar usuario');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '520px', marginTop: '2rem', marginBottom: '4rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                ← Regresar a la tienda
            </Link>
            <div className="card">
                <div className="text-center mb-8">
                    <h2>Registro de Usuario</h2>
                    <p>Crea tu cuenta para comenzar</p>
                </div>

                {success ? (
                    <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', padding: '1.5rem', borderRadius: '0.25rem', border: '1px solid var(--primary)', textAlign: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto' }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <h3 style={{ color: 'var(--primary)' }}>¡Registro Exitoso!</h3>
                        <p>Redirigiendo al login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Nombre Completo</label>
                            <input type="text" id="fullName" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label htmlFor="username">Usuario</label>
                                <input type="text" id="username" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>

                        {error && <div className="error-message mb-4 mt-2">{error}</div>}

                        <button type="submit" className="btn btn-primary btn-block mt-4" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrar Cuenta'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            ¿Ya tienes una cuenta? <Link to="/login" style={{ fontWeight: '500', color: 'var(--primary)' }}>Inicia sesión aquí</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;
