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
        <div className="container p-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-xl font-bold mb-2">{t('dashboard.hello', { name: user?.displayName || 'Worker' })}</h1>
                    <p className="text-muted">
                        {t('dashboard.status')}: <span style={{ color: isConnected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {isConnected ? t('dashboard.online') : t('dashboard.offline')}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="btn btn-secondary" onClick={logout}>{t('nav.logout')}</button>
                </div>
            </header>

            <div>
                <h2 className="text-lg font-bold mb-4">{t('dashboard.todaysTasks')}</h2>

                {loading ? (
                    <p>{t('dashboard.loading')}</p>
                ) : tickets.length === 0 ? (
                    <div className="card p-6 text-center text-muted">
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
