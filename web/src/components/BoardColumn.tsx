import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface BoardColumnProps {
    id: string;
    title: string;
    count: number;
    children: ReactNode;
    isUnassigned?: boolean;
}

export function BoardColumn({ id, title, count, children, isUnassigned }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div
            className="glass-panel"
            style={{
                flex: 1,
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: isUnassigned ? 'rgba(30, 41, 59, 0.4)' : undefined,
                border: isUnassigned ? '1px dashed var(--glass-border)' : undefined
            }}
        >
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
                <span style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontSize: '0.75rem'
                }}>
                    {count}
                </span>
            </div>

            <div
                ref={setNodeRef}
                style={{
                    flex: 1,
                    padding: '1rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
            >
                {children}
            </div>
        </div>
    );
}
