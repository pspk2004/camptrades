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
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <CoinIcon className="h-8 w-8 text-primary-foreground bg-primary p-1 rounded-full" />
              <span className="text-xl font-bold text-foreground">CampTrades</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('marketplace')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Marketplace</button>
              <button onClick={() => onNavigate('wallet')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Wallet</button>
            </nav>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
              <CoinIcon className="w-5 h-5 text-yellow-500" />
              <span className="ml-2 text-sm font-semibold">{user.walletBalance.toLocaleString()}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <img className="h-9 w-9 rounded-full object-cover" src={user.avatar} alt={user.name} />
              </button>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover text-popover-foreground ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical">
                   <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                   </div>
                  <div className="py-1">
                    <button onClick={() => handleDropdownItemClick('my-listings')} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-accent" role="menuitem">
                      <ListingIcon className="h-5 w-5 mr-3 text-muted-foreground"/> My Listings
                    </button>
                    <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10" role="menuitem">
                      <LogoutIcon className="h-5 w-5 mr-3"/> Logout
                    </button>
                  </div>
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