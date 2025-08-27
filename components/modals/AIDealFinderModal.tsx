
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
        } catch (e) {
            setError('An error occurred while searching. Please try again.');
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
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="w-8 h-8 text-yellow-400"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Deal Finder</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Describe what you're looking for, and our AI will find the best deal for you!</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g., 'a cheap textbook for calculus'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:bg-primary-300 disabled:cursor-not-allowed">
                        {isLoading ? 'Finding...' : 'Find'}
                    </button>
                </div>
                
                <div className="mt-6 min-h-[200px] flex items-center justify-center">
                    {isLoading && <div className="text-gray-500 dark:text-gray-400">Searching for the best deal...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {searched && !isLoading && !resultItem && <div className="text-center text-gray-500 dark:text-gray-400">No matching items found. Try a different search!</div>}
                    {resultItem && (
                        <div>
                            <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Here's the best deal I found for you:</h3>
                            <div className="max-w-xs mx-auto">
                               <ItemCard item={resultItem} onBuy={onBuyItem} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AIDealFinderModal;
