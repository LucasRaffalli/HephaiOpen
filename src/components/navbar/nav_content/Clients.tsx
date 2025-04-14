import React, { useEffect, useState } from 'react';
import ClientsList from '@/components/Clients/ClientsList';
import { useClientContext } from '@/components/Clients/ClientContext';
import { Client } from '@/types/hephai';
import { Box, ScrollArea, Button, Dialog, Flex, Text } from '@radix-ui/themes';
import ClientForm from '@/components/Clients/ClientForm';
import { motion } from "framer-motion";
import { t } from 'i18next';
import { PlusIcon } from 'lucide-react';

export default function Clients() {
  const { setSelectedClient } = useClientContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const elementVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      <Flex direction="column" gap="2">
        <motion.div variants={elementVariants}>
          <Button className='btnCursor' variant="soft" onClick={() => setIsFormOpen(true)} style={{ width: '100%' }}>
            <PlusIcon size={16} />
            <Text size="2" weight="regular">{t('buttons.addClient')}</Text>
          </Button>

          <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Dialog.Content style={{ width: '285px' }}>
              <ClientForm />
            </Dialog.Content>
          </Dialog.Root>
        </motion.div>

        <motion.div variants={elementVariants}>
          <Box>
            <ClientsList clients={clients} onInsertClient={handleInsertClient} onDeleteClient={handleDeleteClient} onEditClient={handleEditClient} />
          </Box>
        </motion.div>
      </Flex>
    </motion.div>
  );
}
