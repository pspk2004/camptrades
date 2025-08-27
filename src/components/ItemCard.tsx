import React from 'react';
import type { Item } from '../types';
import { CoinIcon } from './icons/CoinIcon';

interface ItemCardProps {
  item: Item;
  onBuy?: (item: Item) => void;
  onRemove?: (itemId: string) => void;
  showRemoveButton?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onBuy, onRemove, showRemoveButton = false }) => {
    const conditionColorMap = {
        'New': 'bg-green-500/10 text-green-700 dark:text-green-400',
        'Like New': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
        'Good': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        'Used': 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    };
    
    const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3";

    return (
        <div className="bg-card rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col group">
            <div className="relative">
              <img className="h-48 w-full object-cover" src={item.image} alt={item.title} />
              <div className="absolute top-2 right-2">
                 <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${conditionColorMap[item.condition]}`}>
                    {item.condition}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{item.category}</p>
                <h3 className="text-md font-semibold text-foreground mt-1 truncate group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-grow">{item.description.substring(0, 60)}...</p>
                
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xl font-bold text-foreground">
                        <CoinIcon className="w-5 h-5 mr-1.5 text-yellow-500" />
                        <span>{item.price}</span>
                    </div>
                    {showRemoveButton && onRemove ? (
                         <button onClick={() => onRemove(item.id)} className={`${buttonClass} bg-destructive text-destructive-foreground hover:bg-destructive/90`}>
                            Remove
                        </button>
                    ) : (
                        onBuy && (
                            <button onClick={() => onBuy(item)} className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}>
                                Buy
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemCard;