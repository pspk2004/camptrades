import React from 'react';
import type { User, Transaction, Achievement } from '../types';
import { TransactionType } from '../types';
import { CoinIcon } from './icons/CoinIcon';

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const FirstSaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
);

const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach01', title: 'First Sale', description: 'You sold your first item!', unlocked: true, icon: <FirstSaleIcon /> },
    { id: 'ach02', title: 'Top Trader', description: 'Be in the top 10% of traders.', unlocked: false, icon: <TrophyIcon /> },
    { id: 'ach03', title: 'Coin Rich', description: 'Hold over 5000 CCT.', unlocked: false, icon: <CoinIcon className="h-5 w-5" /> },
];


interface WalletProps {
    user: User;
    transactions: Transaction[];
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isCredit = transaction.amount > 0;
    const amountColor = isCredit ? 'text-green-500' : 'text-red-500';
    const sign = isCredit ? '+' : '';

    const transactionTitles = {
        [TransactionType.BUY]: `Bought "${transaction.itemName}"`,
        [TransactionType.SELL]: `Sold "${transaction.itemName}"`,
        [TransactionType.REWARD]: "Weekly Activity Reward",
        [TransactionType.REFERRAL]: "New User Referral",
        [TransactionType.SIGNUP]: "Sign-up Bonus",
    }
    
    return (
        <li className="py-4">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <CoinIcon className={`w-6 h-6 ${isCredit ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {transactionTitles[transaction.type]}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                        {new Date(transaction.date).toLocaleString()}
                    </p>
                </div>
                <div className={`inline-flex items-center text-base font-semibold ${amountColor}`}>
                    {sign}{transaction.amount.toLocaleString()}
                </div>
            </div>
        </li>
    );
};


const Wallet: React.FC<WalletProps> = ({ user, transactions }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-bold text-foreground mb-4">Transaction History</h2>
                    <ul className="divide-y divide-border">
                        {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                            <TransactionRow key={tx.id} transaction={tx} />
                        ))}
                    </ul>
                </div>
            </div>

            <div className="space-y-8">
                 <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-bold text-foreground mb-4">Current Balance</h2>
                    <div className="flex items-center">
                        <CoinIcon className="w-12 h-12 text-yellow-500" />
                        <div className="ml-4">
                            <p className="text-3xl font-bold text-foreground">{user.walletBalance.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">CampusCoins (CCT)</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-bold text-foreground mb-4">Achievements</h2>
                    <div className="space-y-4">
                        {MOCK_ACHIEVEMENTS.map(ach => (
                            <div key={ach.id} className={`flex items-center p-3 rounded-md ${ach.unlocked ? 'bg-green-500/10' : 'bg-secondary'}`}>
                                <div className={`p-1.5 rounded-full ${ach.unlocked ? 'text-green-600 bg-white' : 'text-muted-foreground bg-white dark:bg-muted'}`}>
                                    {ach.icon}
                                </div>
                                <div className="ml-3">
                                    <p className={`font-semibold text-sm ${ach.unlocked ? 'text-green-800 dark:text-green-300' : 'text-foreground'}`}>{ach.title}</p>
                                    <p className={`text-xs ${ach.unlocked ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wallet;