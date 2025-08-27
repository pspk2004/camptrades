import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { authService } from './services/authService';
import { AuthPage } from './components/auth/AuthPage';
import MainLayout from './components/MainLayout';
import type { User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
            setIsLoading(false);
        };
        checkSession();
    }, []);

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = async () => {
        await authService.logout();
        setCurrentUser(null);
    };
    
    const handleUserUpdate = (updatedUser: User) => {
        setCurrentUser(updatedUser);
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <p className="text-gray-600 dark:text-gray-300">Loading your session...</p>
                </div>
            );
        }

        if (currentUser) {
            return <MainLayout user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate}/>;
        }

        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    };

    return (
        <ThemeProvider>
            {renderContent()}
        </ThemeProvider>
    );
};

export default App;
