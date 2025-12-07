import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    RefreshCw,
    CalendarDays,
    LogOut
} from 'lucide-react';

export default function ZooLayout() {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/board', label: 'Board', icon: LayoutDashboard },
        { path: '/workers', label: 'Workers', icon: Users },
        { path: '/cycles', label: 'Cycles', icon: RefreshCw },
        { path: '/shifts', label: 'Shifts', icon: CalendarDays },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{
                width: '260px',
                borderRadius: 0,
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem'
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        AgroFlow
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Zootechnician Panel</p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={20} />
                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#fca5a5',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
}
