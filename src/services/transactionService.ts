import type { Transaction } from '../types';

const getAuthHeaders = () => {
    const token = localStorage.getItem('camp_trades_session_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const transactionService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await fetch('/api/transactions', {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch transactions.');
        }
        return response.json();
    },
};