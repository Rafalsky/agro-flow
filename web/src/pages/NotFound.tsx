import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem'
        }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--color-accent)' }}>404</h1>
            <p style={{ fontSize: '1.2rem' }}>Page not found</p>
            <Link to="/" style={{ color: 'var(--color-primary)', marginTop: '1rem' }}>Go Home</Link>
        </div>
    );
}
