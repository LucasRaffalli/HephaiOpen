import { Client } from '@/types/hephai';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ClientContextProps {
    selectedClient: Client | null;
    setSelectedClient: (client: Client) => void;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    return (
        <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClientContext must be used within a ClientProvider');
    }
    return context;
};
