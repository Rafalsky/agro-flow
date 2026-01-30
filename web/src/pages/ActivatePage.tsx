import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ActivatePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setErrorMessage('Invalid activation link - no token provided');
            return;
        }

        // Call backend activation endpoint
        fetch(`/api/auth/activate?token=${token}`, {
            method: 'GET',
            credentials: 'include', // Important for cookies
        })
            .then(async (res) => {
                if (res.ok || res.redirected) {
                    setStatus('success');
                    // Redirect to app after 2 seconds
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    const text = await res.text();
                    setErrorMessage(text || 'Activation failed');
                }
            })
            .catch((err) => {
                setStatus('error');
                setErrorMessage(err.message || 'Network error');
            });
    }, [searchParams, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <div className="glass-panel" style={{
                padding: '3rem',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
            }}>
                {status === 'loading' && (
                    <>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1.5rem',
                        }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Activating account...</h2>
                        <p style={{ opacity: 0.7 }}>Please wait while we verify your activation token.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem',
                        }}>✅</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#86efac' }}>
                            Activation Successful!
                        </h2>
                        <p style={{ opacity: 0.7 }}>
                            Your account has been activated. Redirecting to the app...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem',
                        }}>❌</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fca5a5' }}>
                            Activation Failed
                        </h2>
                        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
                            {errorMessage || 'The activation link is invalid, expired, or has already been used.'}
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Return to Login
                        </button>
                    </>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
