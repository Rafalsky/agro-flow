import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useBoardTickets } from '../hooks/useBoardTickets';
import { BoardColumn } from '../components/BoardColumn';
import { TicketCard } from '../components/TicketCard';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { useAuth } from '../context/AuthContext';
import type { Ticket } from '../types';
import { Plus } from 'lucide-react';

export default function BoardView() {
    const { logout } = useAuth();
    const { tickets, loading, updateTicket } = useBoardTickets();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor)
    );

    // Group tickets by Assignee
    const boardData = useMemo(() => {
        const unassigned = tickets.filter(t => !t.assigneeId);

        // Extract unique assignees from tickets to build swimlanes dynamically
        // In a real app, we'd fetch all active workers to show empty lanes too
        const workerMap = new Map();
        tickets.forEach(t => {
            if (t.assignee) {
                workerMap.set(t.assignee.id, t.assignee);
            }
        });

        const columns = Array.from(workerMap.values()).map(worker => ({
            id: worker.id,
            title: worker.displayName || worker.email,
            tickets: tickets.filter(t => t.assigneeId === worker.id)
        }));

        return { unassigned, columns };
    }, [tickets]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const ticketId = active.id as string;
        const overId = over.id as string; // This will be the workerId (column id)

        // Find ticket
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        // Check if moved to a different column
        // Column IDs are user IDs, except 'unassigned'
        const targetAssigneeId = overId === 'unassigned' ? null : overId;

        if (ticket.assigneeId !== targetAssigneeId) {
            updateTicket(ticketId, { assigneeId: targetAssigneeId }, ticket.version);
        }
    };

    // We need to pass workers to modal. Extract from board data for now.
    const workers = boardData.columns.map(c => ({ id: c.id, displayName: c.title, email: '', role: 'WORKER' } as any));

    const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null;

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Board...</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 0,
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h1 style={{ fontSize: '1.25rem' }}>Zootechnician Board</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> New Ticket
                    </button>
                    <button className="btn glass-panel" onClick={logout}>Logout</button>
                </div>
            </header>

            <div style={{
                flex: 1,
                overflowX: 'auto',
                padding: '2rem',
                display: 'flex',
                gap: '1.5rem'
            }}>
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {/* Unassigned Column */}
                    <BoardColumn
                        id="unassigned"
                        title="Unassigned"
                        count={boardData.unassigned.length}
                        isUnassigned
                    >
                        {boardData.unassigned.map(t => (
                            // We need a draggable wrapper here actually if we use Sortable
                            // But dnd-kit can drag items directly if we use Draggable. TicketCard isn't draggable itself.
                            // Let's create `DraggableTicket` wrapper inline or separate?
                            // For simplicity, let's wrap here.
                            <DraggableTicket key={t.id} ticket={t} />
                        ))}
                    </BoardColumn>

                    {/* Worker Columns */}
                    {boardData.columns.map(col => (
                        <BoardColumn key={col.id} id={col.id} title={col.title} count={col.tickets.length}>
                            {col.tickets.map(t => (
                                <DraggableTicket key={t.id} ticket={t} />
                            ))}
                        </BoardColumn>
                    ))}

                    <DragOverlay>
                        {activeTicket ? (
                            <div style={{ transform: 'rotate(5deg)' }}>
                                <TicketCard ticket={activeTicket} onStart={() => { }} onFinish={() => { }} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {isModalOpen && <CreateTicketModal workers={workers} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

// Draggable Wrapper
import { useDraggable } from '@dnd-kit/core';

function DraggableTicket({ ticket }: { ticket: Ticket }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: ticket.id,
        data: ticket
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TicketCard
                ticket={ticket}
                onStart={() => { }}
                onFinish={() => { }}
            // Disable buttons in board view, or keep them? 
            // Usually drag handle is card itself.
            // Listeners on root div might block buttons.
            // For now good enough.
            />
        </div>
    );
}
