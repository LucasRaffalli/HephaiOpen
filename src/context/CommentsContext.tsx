import React, { createContext, useContext, useEffect, useState } from 'react';

interface CommentsContextType {
    text: string;
    isEnabled: boolean;
    updateText: (text: string) => void;
    toggleComments: () => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [text, setText] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);

    const updateText = (newText: string) => {
        setText(newText);
    };

    const toggleComments = () => {
        setIsEnabled(prev => !prev);
    };

    return (
        <CommentsContext.Provider value={{
            text,
            isEnabled,
            updateText,
            toggleComments
        }}>
            {children}
        </CommentsContext.Provider>
    );
};

export const useComments = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('useComments must be used within a CommentsProvider');
    }
    return context;
};