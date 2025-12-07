import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTickets } from '../hooks/useTickets';
import { TicketCard } from '../components/TicketCard';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function WorkerDashboard() {
    const { user, logout } = useAuth();
    const { isConnected } = useSocket();
    const { tickets, loading, startTask, finishTask } = useTickets();
    const { t } = useTranslation();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('dashboard.hello', { name: user?.displayName || 'Worker' })}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {t('dashboard.status')}: <span style={{ color: isConnected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {isConnected ? t('dashboard.online') : t('dashboard.offline')}
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LanguageSwitcher />
                    <button className="btn glass-panel" onClick={logout}>{t('nav.logout')}</button>
                </div>
            </header>

            <div>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('dashboard.todaysTasks')}</h2>

                {loading ? (
                    <p>{t('dashboard.loading')}</p>
                ) : tickets.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        {t('dashboard.noTasks')}
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onStart={startTask}
                            onFinish={finishTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
