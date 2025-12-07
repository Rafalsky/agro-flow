import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export default function WorkersPage() {
    const [workers, setWorkers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ displayName: '', email: '', role: 'WORKER' });

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setWorkers(data.filter((u: any) => u.isActive !== false)); // Filter out deactivated if validation weak
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setModalOpen(false);
            setFormData({ displayName: '', email: '', role: 'WORKER' });
            fetchWorkers();
        } catch (e) {
            console.error(e);
            alert('Failed to create worker');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchWorkers();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Workers Management</h1>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Plus size={18} /> Add Worker
                </button>
            </header>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem' }}>Display Name</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map(w => (
                            <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}><span style={{ fontWeight: 500 }}>{w.displayName}</span></td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        backgroundColor: w.role === 'ZOOTECHNICIAN' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                        color: w.role === 'ZOOTECHNICIAN' ? '#93c5fd' : '#86efac',
                                        fontSize: '0.75rem',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {w.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', opacity: 0.5 }}>{w.id.slice(0, 8)}...</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(w.id)}
                                        className="btn"
                                        style={{ padding: '0.5rem', color: '#fca5a5' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Worker</h2>
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Display Name</label>
                                <input
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    placeholder="John Doe"
                                    required
                                    value={formData.displayName}
                                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                                <select
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="WORKER">Worker</option>
                                    <option value="ZOOTECHNICIAN">Zootechnician</option>
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
