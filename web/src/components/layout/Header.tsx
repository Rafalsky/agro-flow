import { Menu, Search, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

interface HeaderProps {
    onToggleSidebar: () => void;
    onNewTicket: () => void;
}

export function Header({ onToggleSidebar, onNewTicket }: HeaderProps) {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <button onClick={onToggleSidebar} className="toggle-btn">
                    <Menu size={20} />
                </button>
                <div className="search-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search data..."
                        className="search-input"
                    />
                </div>
            </div>

            <div className="header-right">
                <button
                    className="btn btn-primary"
                    onClick={onNewTicket}
                >
                    <Plus size={16} /> {t('board.newTicket')}
                </button>

                <LanguageSwitcher />

                <div className="user-profile">
                    <span className="user-email">{user?.email}</span>
                    <div className="user-avatar">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
