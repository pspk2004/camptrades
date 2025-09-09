import type { Item, User, Transaction } from '../types';

const getAuthHeaders = () => {
    const token = localStorage.getItem('camp_trades_session_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const itemService = {
    getItems: async (): Promise<Item[]> => {
        const response = await fetch('/api/items');
        if (!response.ok) {
            throw new Error('Failed to fetch items.');
        }
        return response.json();
    },

    addItem: async (itemData: Omit<Item, 'id' | 'sellerId' | 'sellerName' | 'listedDate'>): Promise<Item> => {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData),
        });
        if (!response.ok) {
            throw new Error('Failed to add item.');
        }
        return response.json();
    },
    
    removeItem: async (itemId: string): Promise<void> => {
        const response = await fetch('/api/items/remove', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ id: itemId }),
        });
        if (!response.ok) {
            throw new Error('Failed to remove item.');
        }
    },

    purchaseItem: async (itemId: string): Promise<{ updatedUser: User, newTransaction: Transaction }> => {
        const response = await fetch('/api/purchase', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ itemId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Purchase failed.');
        }
        return data;
    },
};