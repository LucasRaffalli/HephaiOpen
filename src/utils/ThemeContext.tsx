import { ThemeContextType } from '@/types/hephai';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setDarkMode] = useState<boolean>(false);
    const [accentColor, setAccentColorState] = useState<string>('indigo');
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

    useEffect(() => {
        const storedThemeMode = localStorage.getItem('themeMode') || 'light';
        const storedAccentColor = localStorage.getItem('accentColor');
        setThemeMode(storedThemeMode as 'light' | 'dark' | 'system');

        if (storedAccentColor) {
            setAccentColorState(storedAccentColor);
        }

        updateThemeBasedOnMode(storedThemeMode as 'light' | 'dark' | 'system');
    }, []);

    useEffect(() => {
        if (themeMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setDarkMode(e.matches);
            };
            setDarkMode(mediaQuery.matches);
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [themeMode]);

    const updateThemeBasedOnMode = (mode: 'light' | 'dark' | 'system') => {
        if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        } else {
            setDarkMode(mode === 'dark');
        }
    };

    const toggleTheme = (mode?: 'light' | 'dark' | 'system') => {
        const newMode = mode || (themeMode === 'light' ? 'dark' : 'light');
        setThemeMode(newMode);
        localStorage.setItem('themeMode', newMode);
        updateThemeBasedOnMode(newMode);
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
