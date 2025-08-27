import React from 'react';
import type { Item, User } from '../types';
import ItemCard from './ItemCard';

interface MyListingsProps {
    items: Item[];
    user: User;
    onRemoveItem: (itemId: string) => void;
}

const MyListings: React.FC<MyListingsProps> = ({ items, user, onRemoveItem }) => {
    const userItems = items.filter(item => item.sellerId === user.id);

    return (
        <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
                <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
                <p className="mt-1 text-muted-foreground">Here are the items you're currently selling on CampTrades.</p>
            </div>
            
            {userItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {userItems.map(item => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            onRemove={onRemoveItem}
                            showRemoveButton={true}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-card rounded-lg border">
                    <h3 className="text-xl font-semibold text-foreground">You haven't listed any items yet.</h3>
                    <p className="text-muted-foreground mt-2">Click on "List Item" in the Marketplace to get started!</p>
                </div>
            )}
        </div>
    );
};

export default MyListings;