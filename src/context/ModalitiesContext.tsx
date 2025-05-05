import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModalitiesContextProps {
    text1: string;
    text2: string;
    isEnabled: boolean;
    updateText: (field: "text1" | "text2", value: string) => void;
    toggleModalities: () => void;
}

const ModalitiesContext = createContext<ModalitiesContextProps | undefined>(undefined);

export const ModalitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [text1, setText1] = useState(() => localStorage.getItem('modalitiesText1') || '');
    const [text2, setText2] = useState(() => localStorage.getItem('modalitiesText2') || '');
    const [isEnabled, setIsEnabled] = useState(true);

    const updateText = (field: "text1" | "text2", value: string) => {
        if (field === "text1") {
            setText1(value);
        } else {
            setText2(value);
        }
    };

    const toggleModalities = () => {
        setIsEnabled(prev => !prev);
    };

    return (
        <ModalitiesContext.Provider value={{ text1, text2, isEnabled, updateText, toggleModalities }}>
            {children}
        </ModalitiesContext.Provider>
    );
};

export const useModalities = () => {
    const context = useContext(ModalitiesContext);
    if (!context) {
        throw new Error('useModalities must be used within a ModalitiesProvider');
    }
    return context;
};