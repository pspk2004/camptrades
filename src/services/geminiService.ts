import type { Item } from '../types';

export const findBestItem = async (query: string, items: Item[]): Promise<string | null> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, items }),
        });

        if (!response.ok) {
            let errorMessage = `API error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // Response was not JSON, stick with the status text.
            }
            console.error("API proxy error:", errorMessage);
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result.id || null;

    } catch (error) {
        console.error("Error calling backend proxy:", error);
        return null;
    }
};
