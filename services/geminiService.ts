import type { Item } from '../types';

export const findBestItem = async (query: string, items: Item[]): Promise<string | null> => {
    try {
        // This now calls our own secure backend endpoint on Vercel
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, items }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API proxy error:", errorData.error);
            throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.id || null;

    } catch (error) {
        console.error("Error calling backend proxy:", error);
        return null;
    }
};
