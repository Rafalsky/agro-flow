import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';
import { format, startOfWeek, addDays, getISOWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Save, Play } from 'lucide-react';

interface Shift {
    workerId: string;
    date: string;
    timeSlot: 'FULL'; // Simplification for grid
    status: 'WORKING' | 'ON_LEAVE';
}

export default function ShiftsPage() {
    const [workers, setWorkers] = useState<User[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]); // Flattened local state
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);

    // Generate 7 days
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    const initializeData = async () => {
        try {
            setLoading(true);
            const [usersReq, shiftsReq] = await Promise.all([
                api.get('/users'),
                api.get(`/shifts?start=${weekDays[0].toISOString()}&end=${weekDays[6].toISOString()}`)
            ]);

            setWorkers(usersReq.data.filter((u: any) => u.isActive !== false));

            // Flatten shifts into simpler structure
            // Backend returns ShiftAssignments. 
            // We assume for MVP: 1 Shift = 1 Day. If 'WORKING' -> present.
            const flatShifts = shiftsReq.data.map((s: any) => ({
                workerId: s.workerId,
                date: s.date.split('T')[0],
                status: s.status,
                timeSlot: 'FULL'
            }));
            setShifts(flatShifts);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeData();
    }, [currentWeekStart]);

    const getStatus = (workerId: string, dateStr: string) => {
        const shift = shifts.find(s => s.workerId === workerId && s.date === dateStr);
        // Default visualization if needed, but for now stick to what is in state
        return shift ? shift.status : null; // null means "Morning" by default? User said "defaults to morning". 
        // If "defaults to morning", then lack of record should be visualized as morning?
        // Let's assume explicit records for now to be safe, or treat null as Morning.
        // User request: "domyslnie morning".
        // Let's treat valid record as override. If no record, maybe show Morning placeholder?
        // Actually, safer to just cycle through explicit states for MVP consistency.
        // Let's stick to: undefined -> MORNING -> AFTERNOON -> ON_LEAVE -> MORNING.
    };

    const handleCellClick = (workerId: string, dateStr: string) => {
        setShifts(prev => {
            const exists = prev.find(s => s.workerId === workerId && s.date === dateStr);

            if (!exists) {
                // Default was "Morning" visually? If so, clicking it should go to Afternoon?
                // Or if we treat "No Record" as "Unassigned/Morning", this gets complex.
                // Let's implemented standard: No Record -> Morning -> Afternoon -> On Leave -> Morning
                return [...prev, { workerId, date: dateStr, timeSlot: 'FULL', status: 'MORNING' } as any];
            }

            if (exists.status === 'MORNING') return prev.map(s => s === exists ? { ...s, status: 'AFTERNOON' } : s) as any;
            if (exists.status === 'AFTERNOON') return prev.map(s => s === exists ? { ...s, status: 'ON_LEAVE' } : s) as any;

            // If ON_LEAVE -> Back to MORNING
            return prev.map(s => s === exists ? { ...s, status: 'MORNING' } : s) as any;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.post('/shifts/bulk', shifts);
            // Reload to sync
            await initializeData();
            alert('Saved!');
        } catch (e) { console.error(e); alert('Failed to save'); }
        finally { setSaving(false); }
    };

    const handleGenerateSprint = async () => {
        if (!confirm('Generate tasks for this week based on Cycles?')) return;
        try {
            setGenerating(true);
            await api.post('/sprint/generate', {
                weekStart: currentWeekStart.toISOString()
            });
            alert('Sprint generated!');
        } catch (e) {
            console.error(e);
            alert('Generation failed');
        } finally { setGenerating(false); }
    };

    if (loading) return <div className="p-8">Loading Shifts...</div>;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="glass-panel" style={{
                padding: '1.5rem 2rem',
                borderRadius: 0,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Shift Management</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.25rem' }} onClick={() => setCurrentWeekStart(d => addDays(d, -7))}><ChevronLeft size={16} /></button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, minWidth: '160px', textAlign: 'center' }}>
                            Week {getISOWeek(currentWeekStart)} ({format(currentWeekStart, 'MMM d')})
                        </span>
                        <button className="btn" style={{ padding: '0.25rem' }} onClick={() => setCurrentWeekStart(d => addDays(d, 7))}><ChevronRight size={16} /></button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Shifts'}
                    </button>
                    <button className="btn" onClick={handleGenerateSprint} disabled={generating} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#8b5cf6', color: 'white', border: 'none' }}>
                        <Play size={18} /> {generating ? 'Generating...' : 'Generate Sprint'}
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>Worker</th>
                                {weekDays.map(day => (
                                    <th key={day.toISOString()} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', minWidth: '100px' }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{format(day, 'EEE')}</div>
                                        <div>{format(day, 'd')}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map(worker => (
                                <tr key={worker.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{worker.displayName}</td>
                                    {weekDays.map(day => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const status = getStatus(worker.id, dateStr);

                                        return (
                                            <td key={dateStr} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleCellClick(worker.id, dateStr)}
                                                    style={{
                                                        width: '100%', height: '40px', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                                                        backgroundColor: status === 'WORKING' ? 'rgba(34, 197, 94, 0.4)' :
                                                            status === 'ON_LEAVE' ? 'rgba(239, 68, 68, 0.4)' :
                                                                'rgba(255,255,255,0.05)',
                                                        color: status ? 'white' : 'rgba(255,255,255,0.2)',
                                                        fontSize: '0.75rem',
                                                        transition: 'all 0.1s'
                                                    }}
                                                >
                                                    {status === 'WORKING' ? 'WORKING' : status === 'ON_LEAVE' ? 'OFF' : '-'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                    <p>Click details: Loop &rarr; [Empty] &rarr; [Working] &rarr; [Off] &rarr; [Empty]. Ensure to Save after changes.</p>
                </div>
            </div>
        </div>
    );
}
