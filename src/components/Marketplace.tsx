import React, { useState, useMemo } from 'react';
import type { Item } from '../types';
import { ItemCategory, ItemCondition } from '../types';
import ItemCard from './ItemCard';
import { SparklesIcon } from './icons/SparklesIcon';

interface MarketplaceProps {
    items: Item[];
    onBuyItem: (item: Item) => void;
    onAddItemClick: () => void;
    onAiFinderClick: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ items, onBuyItem, onAddItemClick, onAiFinderClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCondition, setSelectedCondition] = useState<string>('All');
    const [sortBy, setSortBy] = useState('newest');

    const filteredAndSortedItems = useMemo(() => {
        return items
            .filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(item => 
                selectedCategory === 'All' || item.category === selectedCategory
            )
            .filter(item =>
                selectedCondition === 'All' || item.condition === selectedCondition
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'newest':
                    default:
                        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
                }
            });
    }, [items, searchTerm, selectedCategory, selectedCondition, sortBy]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search for items..."
                        className="w-full md:flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={onAiFinderClick} className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-colors">
                            <SparklesIcon className="w-5 h-5"/> AI Deal Finder
                        </button>
                        <button onClick={onAddItemClick} className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                            + List Item
                        </button>
                    </div>
                </div>
                 <div className="flex flex-wrap justify-start gap-4 mt-4">
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 p-2">
                        <option value="All">All Categories</option>
                        {Object.values(ItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 p-2">
                        <option value="All">All Conditions</option>
                        {Object.values(ItemCondition).map(con => <option key={con} value={con}>{con}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 p-2">
                        <option value="newest">Sort: Newest</option>
                        <option value="price-asc">Sort: Price Low to High</option>
                        <option value="price-desc">Sort: Price High to Low</option>
                    </select>
                </div>
            </div>
            
            {filteredAndSortedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedItems.map(item => (
                        <ItemCard key={item.id} item={item} onBuy={onBuyItem} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No items found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
