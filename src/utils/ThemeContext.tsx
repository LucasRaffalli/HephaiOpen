import { AccentColor, ThemeContextType } from '@/type/hephai';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setDarkMode] = useState<boolean>(false);
    const [accentColor, setAccentColorState] = useState<string>('indigo');
    useEffect(() => {
        const storedDarkMode = localStorage.getItem('isDarkMode');
        const storedAccentColor = localStorage.getItem('accentColor');

        if (storedDarkMode !== null) {
            setDarkMode(JSON.parse(storedDarkMode));
        }
        if (storedAccentColor !== null) {
            setAccentColorState(storedAccentColor);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setDarkMode(newMode);
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    };

    const changeAccentColor = (color: string) => {
        setAccentColorState(color);
        localStorage.setItem('accentColor', color);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, accentColor, toggleTheme, setAccentColor: changeAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
