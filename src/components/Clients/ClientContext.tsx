import { Client } from '@/types/hephai';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { generateUniqueId } from '@/utils/generateId';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface ClientContextProps {
    selectedClient: Client | null;
    clients: Client[];
    setSelectedClient: (client: Client | null) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddClient: () => void;
    handleEditClient: (updatedClient: Client) => void;
    handleDeleteClient: (email: string) => void;
    visibility: Record<string, boolean>;
    handleToggleVisibility: (field: string) => void;
    isDarkMode: boolean;
}

const emptyClient: Client = {
    bookmarks: false,
    companyName: '',
    address: '',
    email: '',
    phone: '',
    id: generateUniqueId(),
};

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [isDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [visibility, setVisibility] = useState<Record<string, boolean>>({
        email: false,
        phone: false,
        address: false,
    });

    const loadClients = () => {
        const savedClients = JSON.parse(localStorage.getItem('clients') || '[]') as Client[];
        if (Array.isArray(savedClients)) {
            setClients(savedClients);
        } else {
            console.error('Error loading clients');
            setClients([]);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleToggleVisibility = (field: string) => {
        setVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSelectedClient(prev => ({
            ...(prev || emptyClient),
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddClient = () => {
        if (!selectedClient) return;

        const existingClients = [...clients];
        const isDuplicate = existingClients.some((client) => client.email === selectedClient.email);

        if (isDuplicate) {
            toast.error(t('toast.clientInfo.error'), {
                theme: isDarkMode ? 'dark' : 'light',
            });
            return;
        }

        const updatedClients = [...existingClients, selectedClient];
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setClients(updatedClients);
        setSelectedClient(null);

        toast.success(t('toast.clientInfo.success'), {
            theme: isDarkMode ? 'dark' : 'light',
        });
    };

    const handleEditClient = (updatedClient: Client) => {
        const updatedClients = clients.map(client =>
            client.email === updatedClient.email ? updatedClient : client
        );
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setClients(updatedClients);
    };

    const handleDeleteClient = (email: string) => {
        const updatedClients = clients.filter((client) => client.email !== email);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setClients(updatedClients);
    };

    return (
        <ClientContext.Provider value={{
            selectedClient,
            clients,
            setSelectedClient,
            handleChange,
            handleAddClient,
            handleEditClient,
            handleDeleteClient,
            visibility,
            handleToggleVisibility,
            isDarkMode
        }}>
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
