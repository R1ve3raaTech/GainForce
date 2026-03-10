import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError('Por favor complete todos los campos');
            return;
        }

        setLoading(true);
        try {
            const user = await userService.login(formData.username, formData.password);

            if (user) {
                onLogin(user);
                navigate(user.role === 'admin' ? '/admin' : '/client');
            } else {
                setError('Credenciales inválidas. Intente nuevamente.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor. Asegúrese de que json-server esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '480px', marginTop: '4rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                ← Regresar a la tienda
            </Link>
            <div className="card">
                <div className="text-center mb-8">
                    <h2>Iniciar Sesión</h2>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="error-message mb-4">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
