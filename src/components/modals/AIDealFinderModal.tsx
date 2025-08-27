import React, { useState } from 'react';
import type { Item } from '../../types';
import { findBestItem } from '../../services/geminiService';
import ItemCard from '../ItemCard';
import { SparklesIcon } from '../icons/SparklesIcon';

interface AIDealFinderModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: Item[];
    onBuyItem: (item: Item) => void;
}

const AIDealFinderModal: React.FC<AIDealFinderModalProps> = ({ isOpen, onClose, items, onBuyItem }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultItem, setResultItem] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setResultItem(null);
        setSearched(true);

        try {
            const bestItemId = await findBestItem(query, items);
            if (bestItemId) {
                const foundItem = items.find(item => item.id === bestItemId);
                setResultItem(foundItem || null);
            } else {
                setResultItem(null);
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred while searching. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setQuery('');
        setResultItem(null);
        setError(null);
        setSearched(false);
        onClose();
    }
    
    const inputClass = "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";


    return (
        <>
            <div className="modal-backdrop" onClick={handleModalClose} />
            <div className="modal-content">
                <div className="flex items-center gap-3 mb-2">
                    <SparklesIcon className="w-8 h-8 text-yellow-500"/>
                    <h2 className="text-2xl font-bold text-foreground">AI Deal Finder</h2>
                </div>
                <p className="text-muted-foreground mb-4">Describe what you're looking for, and our AI will find the best deal for you!</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g., 'a cheap textbook for calculus'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={inputClass}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} disabled={isLoading} className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}>
                        {isLoading ? 'Finding...' : 'Find'}
                    </button>
                </div>
                
                <div className="mt-6 min-h-[250px] flex items-center justify-center">
                    {isLoading && <div className="text-muted-foreground">Searching for the best deal...</div>}
                    {error && <div className="text-destructive text-center">{error}</div>}
                    {searched && !isLoading && !resultItem && <div className="text-center text-muted-foreground">No matching items found. Try a different search!</div>}
                    {resultItem && (
                        <div>
                            <h3 className="text-lg font-semibold text-center mb-4 text-foreground">Here's the best deal I found for you:</h3>
                            <div className="max-w-xs mx-auto">
                               <ItemCard item={resultItem} onBuy={onBuyItem} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <button type="button" onClick={handleModalClose} className={`${buttonClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`}>Close</button>
                </div>
            </div>
        </>
    );
};

export default AIDealFinderModal;