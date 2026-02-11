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
        <div className={clsx('card mb-4 flex flex-col gap-4 transition-all', {
            'border-l-4 border-l-green-500 bg-green-900/10': isInProgress,
            'border-l border-l-gray-700': !isInProgress
        })} style={{
            borderLeftColor: isInProgress ? 'var(--color-success)' : undefined
        }}>
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-sm text-muted flex items-center gap-2">
                        <Clock size={14} /> {ticket.timeSlot}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{ticket.title}</h3>
                </div>
                <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', {
                    'bg-green-500/20 text-green-500': isInProgress,
                    'bg-gray-500/10 text-gray-400': !isInProgress
                })} style={{
                    color: isInProgress ? 'var(--color-success)' : undefined,
                    backgroundColor: isInProgress ? 'rgba(16, 185, 129, 0.2)' : undefined
                }}>
                    {ticket.status}
                </span>
            </div>

            {ticket.description && (
                <p className="text-muted">{ticket.description}</p>
            )}

            <div className="flex gap-4 mt-auto">
                {isPending && (
                    <button
                        className="btn btn-primary"
                        onClick={() => onStart(ticket.id, ticket.version)}
                    >
                        <Timer size={18} /> Start Task
                    </button>
                )}

                {isInProgress && (
                    <button
                        className="btn btn-primary"
                        style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                        onClick={() => onFinish(ticket.id, ticket.version)}
                    >
                        <CheckCircle size={18} /> Finish Task
                    </button>
                )}

                {isDone && (
                    <div className="text-green-500 flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                        <CheckCircle size={18} /> Completed
                    </div>
                )}
            </div>
        </div>
    );
}
