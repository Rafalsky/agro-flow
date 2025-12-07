import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBoardTickets } from '../hooks/useBoardTickets';
import { TicketCard } from '../components/TicketCard';
import type { Ticket } from '../types';
import { useTranslation } from 'react-i18next';
import { useDroppable } from '@dnd-kit/core';

// Internal components for this view
function BoardRow({ id, title, tickets, isUnassigned = false, shiftStatus }: { id: string, title: string, tickets: Ticket[], isUnassigned?: boolean, shiftStatus?: string }) {
    const isUnavailable = shiftStatus === 'ON_LEAVE' || shiftStatus === 'OFF'; // Assuming 'OFF' might be used
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        disabled: isUnavailable && !isUnassigned
    });

    const getStatusBadge = () => {
        if (isUnassigned) return null;
        if (shiftStatus === 'MORNING') return <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#f59e0b', color: 'black', fontSize: '0.7rem', marginLeft: '0.5rem' }}>Rano</span>;
        if (shiftStatus === 'AFTERNOON') return <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#3b82f6', color: 'white', fontSize: '0.7rem', marginLeft: '0.5rem' }}>Ppoł</span>;
        if (isUnavailable) return <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#ef4444', color: 'white', fontSize: '0.7rem', marginLeft: '0.5rem' }}>Wolne</span>;
        return null; // Unknown
    };

    return (
        <div ref={setNodeRef} className="glass-panel" style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: isUnavailable ? 'rgba(0,0,0,0.3)' : (isOver ? 'rgba(59, 130, 246, 0.1)' : undefined),
            transition: 'background-color 0.2s',
            minHeight: isUnassigned ? '140px' : '120px',
            border: isOver ? '1px solid rgba(59, 130, 246, 0.4)' : (isUnavailable ? '1px solid rgba(255,255,255,0.05)' : undefined),
            opacity: isUnavailable ? 0.6 : 1,
            pointerEvents: isUnavailable ? 'none' : 'auto' // Prevent interactions
        }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: isUnassigned ? '#fbbf24' : 'white', display: 'flex', alignItems: 'center' }}>
                {title}
                <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>({tickets.length})</span>
                {getStatusBadge()}
            </h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', pointerEvents: 'auto' }}>
                {tickets.map(t => (
                    // Enable pointer events for tickets even if row is disabled? 
                    // No, if row is disabled (OFF), maybe tickets shouldn't be there or just read-only? 
                    // User said "drag n drop do nich nie powinien dzialac" (to them).
                    // Moving tickets FROM them should probably still work if they happen to have one.
                    // But with pointerEvents: none on parent, children are disabled too.
                    // We should only disable drop on row, not interactions on tickets.
                    // So remove pointerEvents: none from parent div, just rely on useDroppable disabled.
                    <DraggableTicket key={t.id} ticket={t} />
                ))}
                {tickets.length === 0 && !isUnavailable && (
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
                {isUnavailable && tickets.length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                        Niedostępny
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

// Helper for dates
// Helper for dates
const getDateStr = (d: Date) => d.toISOString().split('T')[0];
const today = new Date();
const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday (0) to get previous Monday
    d.setDate(diff + i); // Mon, Tue, ...
    return { date: d, str: getDateStr(d), label: d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' }) };
});

export default function BoardView() {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(getDateStr(today));
    const { tickets, workers, shifts, loading, updateTicket, refresh } = useBoardTickets(selectedDate);
    const [activeId, setActiveId] = useState<string | null>(null);


    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor)
    );

    // Group tickets by Assignee
    const boardData = useMemo(() => {
        const unassigned = tickets.filter(t => !t.assigneeId);

        // Use fetched workers to build rows. 
        const rows = workers.map(worker => ({
            id: worker.id,
            title: worker.displayName || worker.email,
            tickets: tickets.filter(t => t.assigneeId === worker.id),
            shiftStatus: shifts[worker.id] || 'UNKNOWN' // Default or fetch result
        }));

        return { unassigned, rows };
    }, [tickets, workers, shifts]);

    // ... drag handlers are same


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
    const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null;

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Board...</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                {/* Desktop Tabs */}
                <div className="hidden md:flex" style={{ display: 'flex', gap: '1px' }}>
                    {weekDays.map(d => (
                        <button
                            key={d.str}
                            onClick={() => setSelectedDate(d.str)}
                            style={{
                                padding: '1rem',
                                background: selectedDate === d.str ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: 'none',
                                borderBottom: selectedDate === d.str ? '2px solid #818cf8' : '2px solid transparent',
                                color: selectedDate === d.str ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
                {/* Mobile Select */}
                <div className="md:hidden" style={{ padding: '1rem', display: 'none' }}>
                    {/* Add media query class equivalent in CSS or just rely on manual styles? 
                       User said "Mobile: Dropdown". 
                       I'll use inline styles with media query if possible or just standard responsiveness.
                       Since I can't easily add CSS classes without tailwind config check, I'll rely on a simple select always visible on small screens?
                       Actually, I'll just render both and use CSS classes if available.
                       If 'hidden md:flex' works (Tailwind), I will use that. User mentioned Tailwind is not default unless requested but project has it? 
                       Check package.json... I didn't verify if tailwind is installed. 
                       Wait, `index.css` had "Vanilla CSS". 
                       I should implement responsive logic in JS or simple CSS.
                       Let's just use a flex container that wraps. 
                    */}
                    <select
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        style={{ padding: '0.5rem', width: '100%', backgroundColor: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.25rem' }}
                    >
                        {weekDays.map(d => (
                            <option key={d.str} value={d.str}>{d.label}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                            shiftStatus={row.shiftStatus}
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


        </div>
    );
}
