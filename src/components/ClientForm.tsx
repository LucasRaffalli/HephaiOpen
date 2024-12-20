import React, { useEffect, useState } from 'react';
import { Box, TextField, Text, Flex, Button, Switch } from '@radix-ui/themes';
import { useClientContext } from '@/components/ClientContext';
import { Client } from '@/type/hephai';
import { t } from 'i18next';
import { toast, ToastContainer } from 'react-toastify';
import { generateUniqueId } from '@/utils/generateId';

const emptyClient: Client = {
    bookmarks: false,
    companyName: '',
    address: '',
    email: '',
    phone: '',
    id: generateUniqueId(),
};

interface ClientFormProps {
    clientInfo: Client | null;
    handleSave?: () => void;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClientAdded?: (client: Client) => void;
    boxWidth?: string;
    flexJustify?: 'start' | 'end' | 'center' | 'between';
}

const ClientForm: React.FC<ClientFormProps> = ({ onClientAdded, flexJustify = 'start', boxWidth = '250px' }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const { selectedClient, setSelectedClient } = useClientContext();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const handleClientAdded = () => {
        loadClients();
        setRefreshKey((prev) => prev + 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setSelectedClient({
            ...(selectedClient || emptyClient),
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleAddClient = () => {
        const newClient = selectedClient || emptyClient;
        const existingClients = JSON.parse(localStorage.getItem('clients') || '[]') as Client[];
        const isDuplicate = existingClients.some((client) => client.email === newClient.email);
        loadClients();
        if (isDuplicate) {
            toast.error(t('toast.clientInfo.error'), {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDarkMode ? 'dark' : 'light',
            });
            return;
        }

        const updatedClients = [...existingClients, newClient];
        localStorage.setItem('clients', JSON.stringify(updatedClients));

        toast.success(t('toast.clientInfo.success'), {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDarkMode ? 'dark' : 'light',
        });

        setSelectedClient(emptyClient);
        handleClientAdded();
        if (onClientAdded) {
            onClientAdded(newClient);
        }
    };

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

    const clientData = selectedClient || emptyClient;

    return (
        <Flex direction="column" gap="3" width="100%" height="fit-content">
            <ToastContainer position="bottom-right" />
            <Flex direction="row" gap="3" wrap="wrap" justify={flexJustify}>
                {Object.entries(clientData).map(([key, value]) => {
                    if (key === 'id') return null;
                    if (key === 'bookmarks') {
                        return (
                            <Box key={key} width={boxWidth} mb="0">
                                <Flex align="center" gap="2">
                                    <Switch checked={value as boolean} onCheckedChange={(checked) => handleChange({ target: { name: 'bookmarks', value: checked } } as any)} />
                                    <Text size="2">{t('buttons.bookmark.base')}</Text>
                                </Flex>
                            </Box>
                        );
                    }
                    return (
                        <Box key={key} width={boxWidth} mb="0">
                            <TextField.Root placeholder={key.charAt(0).toUpperCase() + key.slice(1)} name={key} onChange={handleChange} value={value || ''} size="2" />
                        </Box>
                    );
                })}
            </Flex>
            <Button variant="soft" onClick={handleAddClient}>
                <Text size="2" weight="regular">{t('buttons.addClient')}</Text>
            </Button>
        </Flex>
    );
};

export default ClientForm;
