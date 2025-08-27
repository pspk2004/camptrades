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
        'New': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Like New': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Good': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Used': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
            <img className="h-48 w-full object-cover" src={item.image} alt={item.title} />
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">{item.category}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${conditionColorMap[item.condition]}`}>
                        {item.condition}
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex-grow">{item.description.substring(0, 60)}...</p>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                        <CoinIcon className="w-6 h-6 mr-2 text-yellow-500" />
                        <span>{item.price}</span>
                    </div>
                    {showRemoveButton && onRemove ? (
                         <button onClick={() => onRemove(item.id)} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200">
                            Remove
                        </button>
                    ) : (
                        onBuy && (
                            <button onClick={() => onBuy(item)} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition-colors duration-200">
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
