import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user) {
        return <Navigate to="/" replace />;
    }

    const handleDevLogin = (token: string) => {
        window.location.href = `/api/auth/magic?token=${token}`;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '2rem'
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>AgroFlow</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Sign in to continue</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleDevLogin('dev-worker')}
                    >
                        Login as Worker (Dev)
                    </button>

                    <button
                        className="btn glass-panel"
                        onClick={() => handleDevLogin('dev-zootech')}
                    >
                        Login as Zootechnician (Dev)
                    </button>
                </div>
            </div>
        </div>
    );
}
