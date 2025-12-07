import { useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';
import { X } from 'lucide-react';

interface CreateTicketModalProps {
    onClose: () => void;
    workers: User[];
}

export function CreateTicketModal({ onClose, workers }: CreateTicketModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeSlot: 'MORNING', // MORNING, EVENING, FULL
        assigneeId: '',
        plannedDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/tickets', {
                ...formData,
                assigneeId: formData.assigneeId || null,
                type: 'NORMAL' // Default type
            });
            onClose();
        } catch (error) {
            console.error('Failed to create ticket', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1rem'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '0', overflow: 'hidden' }}>
                <header style={{
                    padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Create New Ticket</h2>
                    <button onClick={onClose} className="btn" style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                        <input
                            required
                            type="text"
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                        <textarea
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', minHeight: '80px' }}
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time Slot</label>
                            <select
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                value={formData.timeSlot}
                                onChange={e => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                            >
                                <option value="MORNING">Morning</option>
                                <option value="EVENING">Evening</option>
                                <option value="FULL">Full Day</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input
                                type="date"
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                value={formData.plannedDate}
                                onChange={e => setFormData(prev => ({ ...prev, plannedDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Assignee (Optional)</label>
                        <select
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                            value={formData.assigneeId}
                            onChange={e => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                        >
                            <option value="">-- Unassigned --</option>
                            {workers.map(w => (
                                <option key={w.id} value={w.id}>{w.displayName || w.email}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
