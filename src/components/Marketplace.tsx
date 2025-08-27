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
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    const inputClass = "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    return (
        <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search for items..."
                        className={inputClass + " md:flex-grow"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex w-full md:w-auto flex-wrap justify-center gap-2">
                        <button onClick={onAiFinderClick} className={`${buttonClass} flex-1 md:flex-initial bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 gap-2`}>
                            <SparklesIcon className="w-5 h-5"/> AI Deal Finder
                        </button>
                        <button onClick={onAddItemClick} className={`${buttonClass} flex-1 md:flex-initial bg-primary text-primary-foreground hover:bg-primary/90`}>
                            + List Item
                        </button>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row justify-start gap-4">
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={inputClass}>
                        <option value="All">All Categories</option>
                        {Object.values(ItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)} className={inputClass}>
                        <option value="All">All Conditions</option>
                        {Object.values(ItemCondition).map(con => <option key={con} value={con}>{con}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={inputClass}>
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
                 <div className="text-center py-16 bg-card rounded-lg border">
                    <h3 className="text-xl font-semibold text-foreground">No items found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;