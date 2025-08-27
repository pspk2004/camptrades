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

    const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-content">
                <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Purchase</h2>
                <div className="flex items-center space-x-4 border-y border-border py-4">
                    <img src={item.image} alt={item.title} className="h-20 w-20 object-cover rounded-md" />
                    <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Sold by {item.sellerName}</p>
                        <div className="flex items-center text-lg font-bold text-foreground mt-2">
                            <CoinIcon className="w-6 h-6 mr-2 text-yellow-500" />
                            <span>{item.price}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground my-6">
                    Are you sure you want to purchase this item? {item.price} CCT will be deducted from your wallet.
                </p>

                <div className="mt-2 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className={`${buttonClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`}>Cancel</button>
                    <button type="button" onClick={onConfirm} className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}>Confirm Purchase</button>
                </div>
            </div>
        </>
    );
};

export default PurchaseConfirmationModal;