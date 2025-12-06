import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Ticket } from '../types';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useBoardTickets(date?: string) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { user } = useAuth(); // Authenticated as Zootechnician

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const query = date ? `?date=${date}` : '';
            const { data } = await api.get(`/tickets/board${query}`);
            setTickets(data);
            // Hack: For now, we only show workers who have tasks or we need a list.
            // Let's implement a quick worker fetch or just rely on tickets for MVP?
            // M8 plan says "Swimlanes (Workers)". Without full worker list, we can't show empty swimlanes.
            // Let's try to infer from unique assignees in tickets + maybe a hardcoded list for demo 
            // OR just add a quick fetch later if critical. 
            // For now, let's stick to simple state.
        } catch (error) {
            console.error('Failed to fetch board', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'ZOOTECHNICIAN') {
            fetchBoard();
        }
    }, [user, date]);

    // Realtime updates
    useEffect(() => {
        if (!socket) return;
        const handleUpdate = (updatedTicket: Ticket) => {
            setTickets(prev => {
                const exists = prev.find(t => t.id === updatedTicket.id);
                if (exists) {
                    return prev.map(t => t.id === updatedTicket.id ? updatedTicket : t);
                }
                return [...prev, updatedTicket];
            });
        };

        // Also listen for created events
        const handleCreate = (newTicket: Ticket) => {
            setTickets(prev => [...prev, newTicket]);
        };

        socket.on('ticket.updated', handleUpdate);
        socket.on('ticket.created', handleCreate); // Gateway must emit this too

        return () => {
            socket.off('ticket.updated', handleUpdate);
            socket.off('ticket.created', handleCreate);
        };
    }, [socket]);

    // Actions
    const updateTicket = async (id: string, updates: Partial<Ticket>, version: number) => {
        // Optimistic update
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates, version: t.version + 1 } : t));

        try {
            await api.patch(`/tickets/${id}`, { ...updates, version });
        } catch (e) {
            console.error("Update failed", e);
            // Revert (fetch board again)
            fetchBoard();
        }
    };

    return { tickets, loading, updateTicket, refetch: fetchBoard };
}
