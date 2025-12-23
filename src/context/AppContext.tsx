import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Investment, AppState } from '../types';

interface AppContextType extends AppState {
    setUser: (user: User | null) => void;
    addInvestment: (investment: Investment) => void;
    logout: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    const setUser = (user: User | null) => setUserState(user);

    const addInvestment = (investment: Investment) => {
        setInvestments((prev) => [investment, ...prev]);
    };

    const logout = () => {
        setUserState(null);
        setInvestments([]);
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <AppContext.Provider value={{
            user,
            investments,
            plans: [],
            setUser,
            addInvestment,
            logout,
            darkMode,
            toggleDarkMode
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
