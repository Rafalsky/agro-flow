import { TicketStatus } from '../types';
import type { Ticket } from '../types';
import clsx from 'clsx';
import { Timer, CheckCircle, Clock } from 'lucide-react';

interface TicketCardProps {
    ticket: Ticket;
    onStart: (id: string, version: number) => void;
    onFinish: (id: string, version: number) => void;
}

export function TicketCard({ ticket, onStart, onFinish }: TicketCardProps) {
    const isPending = ticket.status === TicketStatus.PENDING || ticket.status === TicketStatus.PAUSED;
    const isInProgress = ticket.status === TicketStatus.IN_PROGRESS;
    const isDone = ticket.status === TicketStatus.WORKER_DONE || ticket.status === TicketStatus.DONE;

    return (
        <div className={clsx('glass-panel', {
            'border-green-500': isInProgress, // We need to add border utility or inline style
        })} style={{
            padding: '1.5rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderLeft: isInProgress ? '4px solid var(--color-success)' : '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Clock size={14} /> {ticket.timeSlot}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{ticket.title}</h3>
                </div>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    backgroundColor: isInProgress ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: isInProgress ? 'var(--color-success)' : 'inherit'
                }}>
                    {ticket.status}
                </span>
            </div>

            {ticket.description && (
                <p style={{ color: 'var(--color-text-muted)' }}>{ticket.description}</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                {isPending && (
                    <button
                        className="btn btn-primary"
                        onClick={() => onStart(ticket.id, ticket.version)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Timer size={18} /> Start Task
                    </button>
                )}

                {isInProgress && (
                    <button
                        className="btn"
                        style={{ backgroundColor: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => onFinish(ticket.id, ticket.version)}
                    >
                        <CheckCircle size={18} /> Finish Task
                    </button>
                )}

                {isDone && (
                    <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} /> Completed
                    </div>
                )}
            </div>
        </div>
    );
}
