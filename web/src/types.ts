export const TicketStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    PAUSED: 'PAUSED',
    WORKER_DONE: 'WORKER_DONE',
    QA_REJECTED: 'QA_REJECTED',
    DONE: 'DONE',
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export type UserRole = 'ADMIN' | 'ZOOTECHNICIAN' | 'WORKER' | 'STAKEHOLDER_READONLY';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    displayName: string | null;
}

export interface Ticket {
    id: string;
    title: string;
    description: string | null;
    status: TicketStatus;
    assigneeId: string | null;
    assignee?: User;
    plannedDate: string; // ISO Date
    timeSlot: string; // "08:00-10:00"
    version: number;
}
