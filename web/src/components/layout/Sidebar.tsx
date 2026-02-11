import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    RefreshCw,
    CalendarDays,
    LogOut
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { path: '/board', label: t('nav.board'), icon: LayoutDashboard },
        { path: '/workers', label: t('nav.workers'), icon: Users },
        { path: '/cycles', label: t('nav.cycles'), icon: RefreshCw },
        { path: '/shifts', label: t('nav.shifts'), icon: CalendarDays },
    ];

    return (
        <aside className="sidebar" style={{ width: isOpen ? '260px' : '0px' }}>
            <div className="sidebar-header">
                <div className="brand-icon">L</div>
                <span className="brand-text">AGRO FLOW</span>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section">
                    <span className="section-label">Main</span>
                    <nav className="nav-list">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={18} />
                    <span>{t('nav.logout')}</span>
                </button>
            </div>
        </aside>
    );
}
