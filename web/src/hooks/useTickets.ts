import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Ticket } from '../types';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { user } = useAuth();

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/tickets/me/tasks');
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleTicketUpdated = (updatedTicket: Ticket) => {
            setTickets(prev => {
                const exists = prev.find(t => t.id === updatedTicket.id);
                if (exists) {
                    return prev.map(t => t.id === updatedTicket.id ? updatedTicket : t);
                }
                // If it's a new assignment dynamically added to "today" view logic (basic version)
                // Check if it belongs to today? For now just append if not exists might be risky if it's for another day.
                // But the server only sends updates for relevant tasks.
                // Let's stick to update only for now.
                return prev;
            });
        };

        socket.on('ticket.updated', handleTicketUpdated);

        return () => {
            socket.off('ticket.updated', handleTicketUpdated);
        };
    }, [socket]);

    const startTask = async (id: string, version: number) => {
        await api.patch(`/tickets/${id}/start`, { clientVersion: version });
    };

    const finishTask = async (id: string, version: number) => {
        await api.patch(`/tickets/${id}/finish`, { clientVersion: version });
    };

    return { tickets, loading, startTask, finishTask };
}
