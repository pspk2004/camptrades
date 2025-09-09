import React from 'react';
// Fix: Import Page type for onNavigate prop.
import type { User, Item, Page } from '../types';
import CoinChart from './CoinChart';
import ItemCard from './ItemCard';
import { CoinIcon } from './icons/CoinIcon';

interface DashboardProps {
    user: User;
    items: Item[];
    onBuyItem: (item: Item) => void;
    // Fix: Use Page type for onNavigate prop for better type safety.
    onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, items, onBuyItem, onNavigate }) => {
    const recentItems = items.filter(item => item.sellerId !== user.id).slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CoinChart />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Wallet</h3>
                        <div className="flex items-center mt-4">
                            <CoinIcon className="w-10 h-10 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.walletBalance.toLocaleString()} CCT</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('wallet')} className="w-full mt-6 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-200">
                        View Transactions
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Listings</h2>
                    <button onClick={() => onNavigate('marketplace')} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
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