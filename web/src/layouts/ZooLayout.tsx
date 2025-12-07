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
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--color-bg-dark)' }}>

            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '240px' : '0px',
                transition: 'width 0.3s ease',
                backgroundColor: 'var(--color-bg-card)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 20
            }}>
                <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem',
                        fontWeight: 'bold', color: 'var(--color-bg-dark)'
                    }}>L</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-main)', letterSpacing: '0.5px' }}>
                        AGRO FLOW
                    </span>
                </div>

                <div style={{ padding: '1rem 0', flex: 1 }}>
                    <div style={{
                        padding: '0 1.5rem', marginBottom: '1rem',
                        fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600
                    }}>
                        Main
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
                                        padding: '0.75rem 1.5rem',
                                        color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                                        backgroundColor: isActive ? 'rgba(245, 185, 66, 0.05)' : 'transparent'
                                    }}
                                >
                                    <Icon size={18} color={isActive ? 'var(--color-primary)' : 'currentColor'} />
                                    <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ padding: '1rem' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            width: '100%',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.2s'
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
                    height: '64px',
                    backgroundColor: 'var(--color-bg-dark)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                        >
                            <Menu size={20} />
                        </button>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search data for analysis..."
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                    color: 'var(--color-text-main)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsTicketModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem' }}
                        >
                            <Plus size={16} /> {t('board.newTicket')}
                        </button>

                        <LanguageSwitcher />


                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{user?.email}</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-border)' }}>
                                <img src={`https://ui-avatars.com/api/?name=${user?.email}&background=random`} alt="User" style={{ width: '100%', height: '100%' }} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main style={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    padding: '1.5rem'
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
