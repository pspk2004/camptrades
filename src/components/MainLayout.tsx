import React, { useState, useEffect } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import Marketplace from './Marketplace';
import Wallet from './Wallet';
import MyListings from './MyListings';
import AddItemModal from './modals/AddItemModal';
import PurchaseConfirmationModal from './modals/PurchaseConfirmationModal';
import AIDealFinderModal from './modals/AIDealFinderModal';
import type { User, Item, Transaction, Page } from '../types';
import { itemService } from '../services/itemService';
import { transactionService } from '../services/transactionService';

interface MainLayoutProps {
    user: User;
    onLogout: () => void;
    onUserUpdate: (updatedUser: User) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, onUserUpdate }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal States
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [itemToPurchase, setItemToPurchase] = useState<Item | null>(null);
    const [isAiFinderModalOpen, setAiFinderModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [fetchedItems, fetchedTransactions] = await Promise.all([
                itemService.getItems(),
                transactionService.getTransactions(),
            ]);
            setItems(fetchedItems);
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            // Optionally, show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNavigate = (page: Page) => {
        setActivePage(page);
    };

    const handleBuyItemClick = (item: Item) => {
        if (item.sellerId === user.id) {
            alert("You cannot buy your own item.");
            return;
        }
        if (user.walletBalance >= item.price) {
            setItemToPurchase(item);
            setPurchaseModalOpen(true);
        } else {
            alert("Insufficient funds!");
        }
    };
    
    const handleConfirmPurchase = async () => {
        if (!itemToPurchase) return;

        try {
            const { updatedUser, newTransaction } = await itemService.purchaseItem(itemToPurchase.id);
            onUserUpdate(updatedUser);
            setTransactions(prev => [newTransaction, ...prev]);
            setItems(prev => prev.filter(i => i.id !== itemToPurchase.id));
            
            setPurchaseModalOpen(false);
            setItemToPurchase(null);
            
            alert(`Successfully purchased ${itemToPurchase.title}!`);
        } catch (error) {
            console.error("Purchase failed:", error);
            alert(`Purchase failed: ${(error as Error).message}`);
            setPurchaseModalOpen(false);
        }
    };

    const handleAddItem = async (itemData: Omit<Item, 'id' | 'sellerId' | 'sellerName' | 'listedDate'>) => {
        try {
            const newItem = await itemService.addItem(itemData);
            setItems(prev => [newItem, ...prev]);
        } catch (error) {
            console.error("Failed to add item:", error);
            alert("Failed to list your item. Please try again.");
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if(window.confirm("Are you sure you want to remove this listing?")) {
            try {
                await itemService.removeItem(itemId);
                setItems(prev => prev.filter(item => item.id !== itemId));
            } catch (error) {
                console.error("Failed to remove item:", error);
                alert("Failed to remove your listing. Please try again.");
            }
        }
    }

    const renderPage = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading your CampTrades experience...</p>
                </div>
            );
        }
        
        const marketplaceItems = items.filter(item => item.sellerId !== user.id);

        switch (activePage) {
            case 'marketplace':
                return <Marketplace 
                            items={marketplaceItems} 
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
                return <Dashboard user={user} items={marketplaceItems} onBuyItem={handleBuyItemClick} onNavigate={handleNavigate} />;
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
                items={items.filter(item => item.sellerId !== user.id)}
                onBuyItem={handleBuyItemClick}
            />
        </div>
    );
};

export default MainLayout;
