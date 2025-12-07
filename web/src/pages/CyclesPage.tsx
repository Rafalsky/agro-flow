import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface Cycle {
    id: string;
    title: string;
    dayOfWeek: number;
    timeSlot: 'MORNING' | 'EVENING' | 'FULL';
    isActive: boolean;
}

const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CyclesPage() {
    const { t } = useTranslation();
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null); // For DragOverlay

    const [formData, setFormData] = useState({
        title: '',
        dayOfWeek: 1,
        timeSlot: 'MORNING'
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor)
    );

    const fetchCycles = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cycles');
            setCycles(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCycles();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCycle) {
                await api.patch(`/cycles/${editingCycle.id}`, {
                    title: formData.title,
                    dayOfWeek: Number(formData.dayOfWeek),
                    timeSlot: formData.timeSlot
                });
            } else {
                await api.post('/cycles', {
                    ...formData,
                    dayOfWeek: Number(formData.dayOfWeek)
                });
            }
            setModalOpen(false);
            setEditingCycle(null);
            fetchCycles();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('cycles.deleteConfirm'))) return;
        try {
            await api.delete(`/cycles/${id}`);
            fetchCycles();
        } catch (e) { console.error(e) }
    };

    const openCreateModal = () => {
        setEditingCycle(null);
        setFormData({ title: '', dayOfWeek: 1, timeSlot: 'MORNING' });
        setModalOpen(true);
    };

    const openEditModal = (cycle: Cycle) => {
        setEditingCycle(cycle);
        setFormData({
            title: cycle.title,
            dayOfWeek: cycle.dayOfWeek,
            timeSlot: cycle.timeSlot
        });
        setModalOpen(true);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // active.id is cycleId
        // over.id should be "dayIndex-slot" string
        const cycleId = active.id as string;
        const [dayStr, slot] = (over.id as string).split('|');
        const day = Number(dayStr);

        const cycle = cycles.find(c => c.id === cycleId);
        if (!cycle) return;

        // Optimistic update
        if (cycle.dayOfWeek !== day || cycle.timeSlot !== slot) {
            setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, dayOfWeek: day, timeSlot: slot as any } : c));

            try {
                await api.patch(`/cycles/${cycleId}`, { dayOfWeek: day, timeSlot: slot });
            } catch (e) {
                console.error("Move failed", e);
                fetchCycles(); // Revert on fail
            }
        }
    };

    const getCyclesForSlot = (day: number, slot: string) => {
        return cycles.filter(c => c.dayOfWeek === day && (c.timeSlot === slot || c.timeSlot === 'FULL'));
    };

    const activeCycle = activeId ? cycles.find(c => c.id === activeId) : null;

    if (loading) return <div className="p-8">{t('dashboard.loading')}</div>;

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t('cycles.title')}</h1>
                    <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                        {t('cycles.dragHint')}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Plus size={18} /> {t('cycles.addTask')}
                </button>
            </header>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="glass-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    {/* Header Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr 1fr',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ padding: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Day</div>
                        <div style={{ padding: '1rem', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#fcd34d' }}>
                            Morning
                        </div>
                        <div style={{ padding: '1rem', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#818cf8' }}>
                            Evening
                        </div>
                    </div>

                    {/* Days Rows */}
                    <div>
                        {DAYS_ORDER.map(dayIndex => (
                            <div key={dayIndex} style={{
                                display: 'grid',
                                gridTemplateColumns: '150px 1fr 1fr',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                minHeight: '120px'
                            }}>
                                {/* Day Label */}
                                <div style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.02)'
                                }}>
                                    {DAY_NAMES[dayIndex]}
                                </div>

                                {/* Morning Slot */}
                                <DroppableSlot
                                    id={`${dayIndex}|MORNING`}
                                    items={getCyclesForSlot(dayIndex, 'MORNING')}
                                    onEdit={openEditModal}
                                    onAdd={() => {
                                        setEditingCycle(null);
                                        setFormData({ title: '', dayOfWeek: dayIndex, timeSlot: 'MORNING' });
                                        setModalOpen(true);
                                    }}
                                    onDelete={handleDelete}
                                />

                                {/* Evening Slot */}
                                <DroppableSlot
                                    id={`${dayIndex}|EVENING`}
                                    items={getCyclesForSlot(dayIndex, 'EVENING')}
                                    onEdit={openEditModal}
                                    onAdd={() => {
                                        setEditingCycle(null);
                                        setFormData({ title: '', dayOfWeek: dayIndex, timeSlot: 'EVENING' });
                                        setModalOpen(true);
                                    }}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <DragOverlay>
                    {activeCycle ? <CycleItem cycle={activeCycle} isOverlay /> : null}
                </DragOverlay>
            </DndContext>

            {modalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                            {editingCycle ? t('cycles.editTask') : t('cycles.addTask')}
                        </h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                                <input
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    placeholder="e.g. Feeding"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Day</label>
                                    <select
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                        value={formData.dayOfWeek}
                                        onChange={e => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                                    >
                                        {DAY_NAMES.map((d, i) => (
                                            <option key={d} value={i}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time</label>
                                    <select
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                        value={formData.timeSlot}
                                        onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                    >
                                        <option value="MORNING">Morning</option>
                                        <option value="EVENING">Evening</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingCycle ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function DroppableSlot({ id, items, onEdit, onDelete, onAdd }: {
    id: string,
    items: Cycle[],
    onEdit: (c: Cycle) => void,
    onDelete: (id: string) => void,
    onAdd: () => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            onDoubleClick={() => {
                // Only trigger if clicked directly on the slot or empty space, not bubbled from item?
                // But item stops propagation usually.
                // Let's assume standard behavior.
                onAdd();
            }}
            style={{
                padding: '1rem',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                backgroundColor: isOver ? 'rgba(56, 189, 248, 0.1)' : undefined,
                transition: 'background-color 0.2s',
                minHeight: '100%',
                cursor: 'pointer' // Hint interactivity
            }}
        >
            {items.map(cycle => (
                <SortableCycleItem
                    key={cycle.id}
                    cycle={cycle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

function SortableCycleItem({ cycle, onEdit, onDelete }: {
    cycle: Cycle,
    onEdit: (c: Cycle) => void,
    onDelete: (id: string) => void
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: cycle.id,
        data: cycle
    });

    if (isDragging) {
        return <div ref={setNodeRef} style={{ opacity: 0, height: '40px' }}></div>;
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <CycleItem cycle={cycle} onEdit={onEdit} onDelete={onDelete} />
        </div>
    );
}

function CycleItem({ cycle, onEdit, onDelete, isOverlay }: {
    cycle: Cycle,
    onEdit?: (c: Cycle) => void,
    onDelete?: (id: string) => void,
    isOverlay?: boolean
}) {
    return (
        <div
            onDoubleClick={(e) => {
                e.stopPropagation(); // prevent drag start if overlapping
                onEdit && onEdit(cycle);
            }}
            style={{
                backgroundColor: isOverlay ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: isOverlay ? 'grabbing' : 'grab',
                boxShadow: isOverlay ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : 'none',
                transform: isOverlay ? 'scale(1.05)' : 'none',
                userSelect: 'none'
            }}
        >
            <span style={{ fontWeight: 500 }}>{cycle.title}</span>
            {!isOverlay && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cycle.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag functionality from hijacking click
                    style={{ color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
}
