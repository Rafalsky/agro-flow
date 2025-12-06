import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTickets } from '../hooks/useTickets';
import { TicketCard } from '../components/TicketCard';

export default function WorkerDashboard() {
    const { user, logout } = useAuth();
    const { isConnected } = useSocket();
    const { tickets, loading, startTask, finishTask } = useTickets();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hello, {user?.displayName || 'Worker'}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Status: <span style={{ color: isConnected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {isConnected ? 'Online' : 'Offline'}
                        </span>
                    </p>
                </div>
                <button className="btn glass-panel" onClick={logout}>Logout</button>
            </header>

            <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Today's Tasks</h2>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tickets.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No tasks assigned for today.
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
