export enum ItemCategory {
  BOOKS = 'Books',
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  OTHER = 'Other',
}

export enum ItemCondition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  USED = 'Used',
}

export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: ItemCategory;
  condition: ItemCondition;
  sellerId: string;
  sellerName: string;
  listedDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  collegeId: string;
  avatar: string;
  walletBalance: number;
  password?: string;
}

export type Page = 'dashboard' | 'marketplace' | 'wallet' | 'my-listings';

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  REWARD = 'reward',
  REFERRAL = 'referral',
  SIGNUP = 'signup'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  itemId?: string;
  itemName?: string;
  amount: number;
  date: string;
  from: string;
  to: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    icon: React.ReactNode;
}
