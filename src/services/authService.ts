import type { User } from '../types';

const SESSION_TOKEN_KEY = 'camp_trades_session_token';

const getAuthHeaders = () => {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authService = {
    register: async (name: string, email: string, password: string, collegeId: string): Promise<User> => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, collegeId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed.');
        }
        localStorage.setItem(SESSION_TOKEN_KEY, data.token);
        return data.user;
    },

    login: async (email: string, password: string): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Invalid email or password.');
        }
        localStorage.setItem(SESSION_TOKEN_KEY, data.token);
        return data.user;
    },

    logout: async (): Promise<void> => {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (token) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            localStorage.removeItem(SESSION_TOKEN_KEY);
        }
        return Promise.resolve();
    },

    getCurrentUser: async (): Promise<User | null> => {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (!token) {
            return null;
        }
        try {
            const response = await fetch('/api/auth/session', {
                headers: getAuthHeaders(),
            });
            if (response.status === 401) { // Token is invalid or expired
                localStorage.removeItem(SESSION_TOKEN_KEY);
                return null;
            }
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error("Session check failed:", error);
            return null;
        }
    },
};
