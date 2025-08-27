import React, { useState, useRef, useEffect } from 'react';
import type { User, Page } from '../types';
import { useTheme } from '../hooks/useTheme';
import { CoinIcon } from './icons/CoinIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ListingIcon } from './icons/ListingIcon';

interface HeaderProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (page: Page) => {
    onNavigate(page);
    setDropdownOpen(false);
  }

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <CoinIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">CampTrades</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('marketplace')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Marketplace</button>
              <button onClick={() => onNavigate('wallet')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Wallet</button>
            </nav>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-primary-50 dark:bg-primary-900/50 px-3 py-1.5 rounded-full">
              <CoinIcon className="w-5 h-5 text-yellow-500" />
              <span className="ml-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{user.walletBalance.toLocaleString()}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="block focus:outline-none">
                <img className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 ring-primary-500" src={user.avatar} alt={user.name} />
              </button>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none transition-all duration-200" role="menu" aria-orientation="vertical">
                   <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-900 dark:text-white font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                   </div>
                  <button onClick={() => handleDropdownItemClick('my-listings')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                    <ListingIcon className="h-5 w-5 mr-3"/> My Listings
                  </button>
                  <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" role="menuitem">
                    <LogoutIcon className="h-5 w-5 mr-3"/> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
