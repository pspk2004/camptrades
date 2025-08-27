
import React from 'react';
import type { Item } from '../../types';
import { CoinIcon } from '../icons/CoinIcon';

interface PurchaseConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    item: Item | null;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirm Purchase</h2>
                <div className="flex items-center space-x-4 border-y border-gray-200 dark:border-gray-700 py-4">
                    <img src={item.image} alt={item.title} className="h-20 w-20 object-cover rounded-md" />
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sold by {item.sellerName}</p>
                        <div className="flex items-center text-lg font-bold text-gray-900 dark:text-white mt-2">
                            <CoinIcon className="w-6 h-6 mr-2 text-yellow-500" />
                            <span>{item.price}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 my-6">
                    Are you sure you want to purchase this item? {item.price} CCT will be deducted from your wallet.
                </p>

                <div className="mt-8 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">Confirm Purchase</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseConfirmationModal;
