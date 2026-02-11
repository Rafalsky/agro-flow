import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { api } from '../lib/api';
import type { User } from '../types';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export default function ZooLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Global actions state
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [workers, setWorkers] = useState<User[]>([]);

    useEffect(() => {
        if (isTicketModalOpen && workers.length === 0) {
            api.get('/users').then(res => {
                const activeWorkers = res.data.filter((u: any) => u.isActive !== false && u.role === 'WORKER');
                setWorkers(activeWorkers);
            }).catch(console.error);
        }
    }, [isTicketModalOpen]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-app">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNewTicket={() => setIsTicketModalOpen(true)}
                />

                <main className="flex-1 overflow-auto p-6 relative">
                    <Outlet />
                </main>
            </div>

            {isTicketModalOpen && (
                <CreateTicketModal
                    workers={workers}
                    onClose={() => setIsTicketModalOpen(false)}
                />
            )}
        </div>
    );
}
