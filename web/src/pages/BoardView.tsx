import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBoardTickets } from '../hooks/useBoardTickets';
import { TicketCard } from '../components/TicketCard';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import type { Ticket } from '../types';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDroppable } from '@dnd-kit/core';

// Internal components for this view
function BoardRow({ id, title, tickets, isUnassigned = false }: { id: string, title: string, tickets: Ticket[], isUnassigned?: boolean }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className="glass-panel" style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
            transition: 'background-color 0.2s',
            minHeight: isUnassigned ? '140px' : '120px',
            border: isOver ? '1px solid rgba(59, 130, 246, 0.4)' : undefined
        }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: isUnassigned ? '#fbbf24' : 'white' }}>
                {title} <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>({tickets.length})</span>
            </h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {tickets.map(t => (
                    <DraggableTicket key={t.id} ticket={t} />
                ))}
                {tickets.length === 0 && (
                    <div style={{
                        height: '100px',
                        width: '200px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        {isUnassigned ? 'No unassigned tickets' : 'Drop here to assign'}
                    </div>
                )}
            </div>
        </div>
    );
}

// Draggable Wrapper
import { useDraggable } from '@dnd-kit/core';

function DraggableTicket({ ticket }: { ticket: Ticket }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: ticket.id,
        data: ticket
    });

    if (isDragging) {
        return <div ref={setNodeRef} style={{ opacity: 0, width: 300, height: 150 }} />;
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <TicketCard
                ticket={ticket}
                onStart={() => { }}
                onFinish={() => { }}
            />
        </div>
    );
}

export default function BoardView() {
    const { logout } = useAuth();
    const { t } = useTranslation();
    const { tickets, loading, updateTicket, refresh } = useBoardTickets();
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
        const workerMap = new Map();
        tickets.forEach(t => {
            if (t.assignee) {
                workerMap.set(t.assignee.id, t.assignee);
            }
        });

        const rows = Array.from(workerMap.values()).map(worker => ({
            id: worker.id,
            title: worker.displayName || worker.email,
            tickets: tickets.filter(t => t.assigneeId === worker.id)
        }));

        return { unassigned, rows };
    }, [tickets]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const ticketId = active.id as string;
        const overId = over.id as string; // This will be the workerId (row id) or 'unassigned'

        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const targetAssigneeId = overId === 'unassigned' ? null : overId;

        if (ticket.assigneeId !== targetAssigneeId) {
            // Optimistic update could happen here, but hook handles it via re-fetch mostly
            // Ideally we'd update local state immediately
            await updateTicket(ticketId, { assigneeId: targetAssigneeId }, ticket.version);
            refresh();
        }
    };

    // We need to pass workers to modal
    const workers = boardData.rows.map(r => ({ id: r.id, displayName: r.title, email: '', role: 'WORKER' } as any));
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
                <h1 style={{ fontSize: '1.25rem' }}>{t('board.title')}</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> {t('board.newTicket')}
                    </button>

                    <LanguageSwitcher />

                    <button className="btn glass-panel" onClick={logout}>{t('nav.logout')}</button>
                </div>
            </header>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {/* Unassigned Area at Top */}
                    <BoardRow
                        id="unassigned"
                        title={t('board.unassigned')}
                        tickets={boardData.unassigned}
                        isUnassigned
                    />

                    {/* Worker Rows */}
                    {boardData.rows.map(row => (
                        <BoardRow
                            key={row.id}
                            id={row.id}
                            title={row.title}
                            tickets={row.tickets}
                        />
                    ))}

                    <DragOverlay>
                        {activeTicket ? (
                            <div style={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
                                <TicketCard ticket={activeTicket} onStart={() => { }} onFinish={() => { }} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {isModalOpen && (
                <CreateTicketModal
                    workers={workers}
                    onClose={() => {
                        setIsModalOpen(false);
                        refresh(); // Refresh on close to catch new ticket
                    }}
                />
            )}
        </div>
    );
}
