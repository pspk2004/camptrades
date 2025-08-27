import React from 'react';
import type { User, Item, Page } from '../types';
import CoinChart from './CoinChart';
import ItemCard from './ItemCard';
import { CoinIcon } from './icons/CoinIcon';

interface DashboardProps {
    user: User;
    items: Item[];
    onBuyItem: (item: Item) => void;
    onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, items, onBuyItem, onNavigate }) => {
    const recentItems = items.slice(0, 3);
    const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-6";


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CoinChart />
                </div>
                <div className="bg-card p-6 rounded-lg border flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Your Wallet</h3>
                        <div className="flex items-center mt-4">
                            <CoinIcon className="w-10 h-10 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm text-muted-foreground">Balance</p>
                                <p className="text-2xl font-bold text-foreground">{user.walletBalance.toLocaleString()} CCT</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('wallet')} className={buttonClass}>
                        View Transactions
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Recent Listings</h2>
                    <button onClick={() => onNavigate('marketplace')} className="text-sm font-medium text-primary hover:underline">
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentItems.map(item => (
                        <ItemCard key={item.id} item={item} onBuy={onBuyItem} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;