
import React, { useState } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import Marketplace from './Marketplace';
import Wallet from './Wallet';
import MyListings from './MyListings';
import AddItemModal from './modals/AddItemModal';
import PurchaseConfirmationModal from './modals/PurchaseConfirmationModal';
import AIDealFinderModal from './modals/AIDealFinderModal';
import { MOCK_ITEMS, MOCK_TRANSACTIONS } from '../constants';
import type { User, Item, Transaction, Page } from '../types';
import { TransactionType } from '../types';

interface MainLayoutProps {
    user: User;
    onLogout: () => void;
    onUserUpdate: (updatedUser: User) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, onUserUpdate }) => {
    const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [activePage, setActivePage] = useState<Page>('dashboard');
    
    // Modal States
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [itemToPurchase, setItemToPurchase] = useState<Item | null>(null);
    const [isAiFinderModalOpen, setAiFinderModalOpen] = useState(false);

    const handleNavigate = (page: Page) => {
        setActivePage(page);
    };

    const handleBuyItemClick = (item: Item) => {
        if (user.walletBalance >= item.price) {
            setItemToPurchase(item);
            setPurchaseModalOpen(true);
        } else {
            alert("Insufficient funds!");
        }
    };
    
    const handleConfirmPurchase = () => {
        if (!itemToPurchase) return;

        const newBalance = user.walletBalance - itemToPurchase.price;
        const updatedUser = { ...user, walletBalance: newBalance };
        onUserUpdate(updatedUser);

        const newTransaction: Transaction = {
            id: `txn${Date.now()}`,
            type: TransactionType.BUY,
            itemId: itemToPurchase.id,
            itemName: itemToPurchase.title,
            amount: -itemToPurchase.price,
            date: new Date().toISOString(),
            from: user.name,
            to: itemToPurchase.sellerName,
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setItems(prev => prev.filter(i => i.id !== itemToPurchase.id));
        
        setPurchaseModalOpen(false);
        setItemToPurchase(null);
        
        alert(`Successfully purchased ${itemToPurchase.title}!`);
    };

    const handleAddItem = (itemData: Omit<Item, 'id' | 'sellerId' | 'sellerName' | 'listedDate'>) => {
        const newItem: Item = {
            ...itemData,
            id: `item${Date.now()}`,
            sellerId: user.id,
            sellerName: user.name,
            listedDate: new Date().toISOString(),
        };
        setItems(prev => [newItem, ...prev]);
    };

    const handleRemoveItem = (itemId: string) => {
        if(window.confirm("Are you sure you want to remove this listing?")) {
            setItems(prev => prev.filter(item => item.id !== itemId));
        }
    }


    const renderPage = () => {
        switch (activePage) {
            case 'marketplace':
                return <Marketplace 
                            items={items} 
                            onBuyItem={handleBuyItemClick} 
                            onAddItemClick={() => setAddItemModalOpen(true)}
                            onAiFinderClick={() => setAiFinderModalOpen(true)}
                        />;
            case 'wallet':
                return <Wallet user={user} transactions={transactions} />;
            case 'my-listings':
                return <MyListings user={user} items={items} onRemoveItem={handleRemoveItem} />;
            case 'dashboard':
            default:
                return <Dashboard user={user} items={items} onBuyItem={handleBuyItemClick} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Header user={user} onNavigate={handleNavigate} onLogout={onLogout} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
            <AddItemModal 
                isOpen={isAddItemModalOpen}
                onClose={() => setAddItemModalOpen(false)}
                onAddItem={handleAddItem}
            />
            <PurchaseConfirmationModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setPurchaseModalOpen(false)}
                onConfirm={handleConfirmPurchase}
                item={itemToPurchase}
            />
            <AIDealFinderModal
                isOpen={isAiFinderModalOpen}
                onClose={() => setAiFinderModalOpen(false)}
                items={items}
                onBuyItem={handleBuyItemClick}
            />
        </div>
    );
};

export default MainLayout;
