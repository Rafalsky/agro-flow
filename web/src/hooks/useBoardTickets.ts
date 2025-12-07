import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Ticket, User } from '../types';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useBoardTickets(date?: string) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [workers, setWorkers] = useState<User[]>([]);
    const [shifts, setShifts] = useState<Record<string, string>>({}); // WorkerID -> Status
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { user } = useAuth(); // Authenticated as Zootechnician

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const query = date ? `?date=${date}` : '';
            const [ticketsReq, usersReq, shiftsReq] = await Promise.all([
                api.get(`/tickets/board${query}`),
                api.get('/users'),
                api.get(`/shifts${query}`) // Assuming this endpoint exists and filters by date
            ]);

            setTickets(ticketsReq.data);
            // Filter only active workers
            setWorkers(usersReq.data.filter((u: any) => u.isActive !== false && u.role === 'WORKER'));

            // Process shifts into a map
            const shiftMap: Record<string, string> = {};
            if (Array.isArray(shiftsReq.data)) {
                shiftsReq.data.forEach((s: any) => {
                    shiftMap[s.workerId] = s.status;
                });
            }
            setShifts(shiftMap);

        } catch (error) {
            console.error('Failed to fetch board data', error);
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

    return { tickets, workers, shifts, loading, updateTicket, refresh: fetchBoard, refetch: fetchBoard };
}
