import React, { createContext, useContext, useState } from 'react';

export type PopupType = 'datePicker' | 'payment' | 'client' | 'navigate' | 'fileCustomName' | 'dynamicColumnEditor' | 'InvoiceItemEditor' | 'modalities' | 'comments' | null;

interface ToolbarContextType {
    activePopup: PopupType;
    setActivePopup: (popup: PopupType) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activePopup, setActivePopup] = useState<PopupType>(null);

    return (
        <ToolbarContext.Provider value={{ activePopup, setActivePopup }}>
            {children}
        </ToolbarContext.Provider>
    );
};

export const useToolbar = () => {
    const context = useContext(ToolbarContext);
    if (!context) {
        throw new Error('useToolbar must be used within a ToolbarProvider');
    }
    return context;
};