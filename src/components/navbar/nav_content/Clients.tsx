import React, { useEffect, useState } from 'react';
import ClientsList from '@/components/ClientsList';
import { useClientContext } from '@/components/ClientContext';
import { Client } from '@/type/hephai';
import { Box, ScrollArea } from '@radix-ui/themes';
import ClientForm from '@/components/ClientForm';

export default function Clients() {
  const { setSelectedClient } = useClientContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { const savedMode = localStorage.getItem('isDarkMode'); return savedMode ? JSON.parse(savedMode) : false; });

  const loadClients = () => {
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]') as Client[];
    console.log('Clients loaded:', savedClients); // Debug
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

  const handleDeleteClient = (email: string) => {
    const updatedClients = clients.filter((client) => client.email !== email);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  const handleInsertClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEditClient = (updatedClient: Client) => {
    const updatedClients = clients.map(client =>
      client.email === updatedClient.email ? updatedClient : client
    );
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  return (
    <ScrollArea style={{ "height": "96%" }}>
      <Box className='ClientParent' pr={'4'} width={"100%"}>
        <ClientsList onInsertClient={handleInsertClient} onDeleteClient={handleDeleteClient} clients={clients} onEditClient={handleEditClient} />
      </Box>
    </ScrollArea>
  );
}
