import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface Cycle {
    id: string;
    title: string;
    dayOfWeek: number; // 1-7
    timeSlot: string;
    isActive: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CyclesPage() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        dayOfWeek: 1,
        timeSlot: 'MORNING'
    });

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/cycles', {
                ...formData,
                dayOfWeek: Number(formData.dayOfWeek)
            });
            setModalOpen(false);
            fetchCycles();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this cycle?')) return;
        try {
            await api.delete(`/cycles/${id}`);
            fetchCycles();
        } catch (e) { console.error(e) }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Cycle Definitions</h1>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Plus size={18} /> New Cycle
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {cycles.map(cycle => (
                    <div key={cycle.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                        <button
                            onClick={() => handleDelete(cycle.id)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} />
                        </button>

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{cycle.title}</h3>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                fontSize: '0.875rem', color: 'bg-white/60',
                                backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem'
                            }}>
                                <Calendar size={14} />
                                {DAYS[cycle.dayOfWeek]}
                            </div>

                            <div style={{
                                fontSize: '0.875rem',
                                backgroundColor: cycle.timeSlot === 'MORNING' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(129, 140, 248, 0.2)',
                                color: cycle.timeSlot === 'MORNING' ? '#fcd34d' : '#a5b4fc',
                                padding: '0.25rem 0.75rem', borderRadius: '0.25rem'
                            }}>
                                {cycle.timeSlot}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Cycle</h2>
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                                <input
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    placeholder="e.g. Mowing"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Day of Week</label>
                                <select
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    value={formData.dayOfWeek}
                                    onChange={e => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                                >
                                    {DAYS.map((d, i) => (
                                        <option key={d} value={i}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time Slot</label>
                                <select
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    value={formData.timeSlot}
                                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                >
                                    <option value="MORNING">Morning</option>
                                    <option value="EVENING">Evening</option>
                                    <option value="FULL">Full Day</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
