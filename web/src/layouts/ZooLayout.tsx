import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    RefreshCw,
    CalendarDays,
    LogOut,
    Search,
    Menu,
    Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { api } from '../lib/api';
import type { User } from '../types';

export default function ZooLayout() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Global actions state
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [workers, setWorkers] = useState<User[]>([]);

    useEffect(() => {
        if (isTicketModalOpen && workers.length === 0) {
            api.get('/users').then(res => {
                const activeWorkers = res.data.filter((u: any) => u.isActive !== false && u.role === 'WORKER');
                setWorkers(activeWorkers);
            }).catch(console.error);
        }
    }, [isTicketModalOpen]);

    const navItems = [
        { path: '/board', label: t('nav.board'), icon: LayoutDashboard },
        { path: '/workers', label: t('nav.workers'), icon: Users },
        { path: '/cycles', label: t('nav.cycles'), icon: RefreshCw },
        { path: '/shifts', label: t('nav.shifts'), icon: CalendarDays },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)' }}>

            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '260px' : '0px',
                transition: 'width 0.3s ease',
                backgroundColor: 'var(--color-bg-card)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 20
            }}>
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem',
                        fontWeight: 'bold', color: 'var(--color-primary-text)', fontSize: '1.2rem'
                    }}>
                        <RefreshCw size={20} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
                        EcoFarm
                    </span>
                </div>

                <div style={{ padding: '1.5rem 1rem', flex: 1 }}>
                    <div style={{
                        padding: '0 1rem', marginBottom: '0.75rem',
                        fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em'
                    }}>
                        Menu
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        borderRadius: '8px',
                                        backgroundColor: isActive ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                                        fontWeight: isActive ? 600 : 500
                                    }}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            width: '100%',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-danger)';
                            e.currentTarget.style.color = 'var(--color-danger)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                    >
                        <LogOut size={18} />
                        <span>{t('nav.logout')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Topbar */}
                <header style={{
                    height: '70px',
                    backgroundColor: 'var(--color-bg-card)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsTicketModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '8px' }}
                        >
                            <Plus size={18} /> {t('board.newTicket')}
                        </button>

                        <LanguageSwitcher />
                    </div>
                </header>

                {/* Content */}
                <main style={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    padding: '2rem'
                }}>
                    <Outlet />
                </main>
            </div>

            {isTicketModalOpen && (
                <CreateTicketModal
                    workers={workers}
                    onClose={() => setIsTicketModalOpen(false)}
                />
            )}
        </div>
    );
}
