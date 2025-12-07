import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'ZOOTECHNICIAN' | 'WORKER' | 'STAKEHOLDER_READONLY';
    displayName: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: () => void; // Trigger login flow (dev or magic link redirect)
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = () => {
        // For now, redirect to magic link or dev login
        // In production, this would trigger email input or external auth
        // Dev shortcut:
        // window.location.href = '/api/auth/magic?email=worker@agro.flow'; 
    };

    const logout = async () => {
        // Implement logout endpoint if exists, or just clear state
        setUser(null);
        // await api.post('/auth/logout');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
