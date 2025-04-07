import React, { useEffect, useRef, useState } from 'react';
import { AlertDialog, Avatar, Box, Button, Callout, Card, ContextMenu, Dialog, DropdownMenu, Flex, Heading, HoverCard, IconButton, Inset, Link, Progress, ScrollArea, Separator, Skeleton, Strong, Switch, Text, TextField, Tooltip } from '@radix-ui/themes';
import { Client } from '@/types/hephai';
import { AvatarIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { BookAIcon, BookUser, EllipsisVertical, FileInput, IdCard } from 'lucide-react';
import { DeleteIcon, SparklesIcon, SquarePenIcon } from '@/components/design/IconsAnimate';
import { truncateText } from '@/utils/TruncateText';
import AnimatedText from '@/utils/AnimatedText';
import { t } from 'i18next';


interface ClientsListProps {
    clients: Client[] | null;
    onInsertClient: (client: Client) => void;
    onDeleteClient: (email: string) => void;
    onEditClient: (updatedClient: Client) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onInsertClient, onDeleteClient, onEditClient }) => {
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [, setClients] = useState<Client[]>([]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingClient) return;

        const { name, value } = e.target;
        setEditingClient({
            ...editingClient,
            [name]: value,
        });
    };

    const handleEditSave = () => {
        if (editingClient) {
            onEditClient(editingClient);
            setEditingClient(null);
            setDialogOpen(false);
        }
    };

    const getInitials = (companyName: string, length: number = 2) => {
        return companyName.substring(0, length);
    };
    const handleDialogKeyDown = (e: React.KeyboardEvent) => {

        e.stopPropagation();
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



    const toggleBookmark = (email: string) => {
        if (!clients) return;
        const updatedClients = clients.map((client) =>
            client.email === email ? { ...client, bookmarks: !client.bookmarks } : client
        );
        localStorage.setItem('clients', JSON.stringify(updatedClients));
    };


    return (
        <Box className='Component-Client-List' >

            {clients && Array.isArray(clients) && clients.length > 0 ? (
                <Flex direction={'column'} gap={'2'} className='FlexComponent' >
                    {clients.sort((a, b) => (b.bookmarks ? 1 : 0) - (a.bookmarks ? 1 : 0)).map((client, index) => (
                        <Card key={index} variant={"surface"} style={{ border: client.bookmarks ? "0.5px solid var(--gold-8)" : "0.5px solid transparent" }} >
                            <Flex justify={'between'} gap={"3"} >
                                <Avatar fallback={getInitials(client.companyName, 1)} />
                                <Flex direction={'column'} align={'start'} >
                                    <Text size={"3"} weight="bold"></Text>
                                    <AnimatedText text={client.companyName} containerWidth={98} speed={26} />
                                    <Text size={"2"} color={'gray'}>{truncateText(client.email, 8)}</Text>
                                </Flex>
                                <Flex direction={"column"} justify={"between"} >
                                    {/*  */}
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <EllipsisVertical size={"20"} color='gray' />
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item>
                                                <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                                                    <Dialog.Trigger onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}>
                                                        <Flex align={"center"} gap={"2"} justify={"between"} width={"100%"} >
                                                            <Text>{t('buttons.edit')}</Text>
                                                            <SquarePenIcon size={16} />
                                                        </Flex>
                                                    </Dialog.Trigger>
                                                    <Dialog.Content maxWidth="450px" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}
                                                        onKeyDown={handleDialogKeyDown}>
                                                        <Dialog.Title>{t('popup.edit.client.title')}</Dialog.Title>
                                                        <Dialog.Description size="2" mb="4">{t('popup.edit.client.description')}</Dialog.Description>
                                                        <Flex direction="column" gap="3" onPointerDown={(e) => e.stopPropagation()}>

                                                            {editingClient && Object.entries(editingClient).map(([key, value]) => {
                                                                if (key === 'id') return null;
                                                                if (key === 'bookmarks') {
                                                                    return (
                                                                        <Box key={key} width={'250px'} mb="0">
                                                                            <Flex align="center" gap="2">
                                                                                <Switch checked={value as boolean} onCheckedChange={(checked) => handleEditChange({ target: { name: 'bookmarks', value: checked } } as any)} />
                                                                                <Text size="2">{t('buttons.bookmark.base')}</Text>
                                                                            </Flex>
                                                                        </Box>
                                                                    );
                                                                }
                                                                return (
                                                                    <label key={key}>
                                                                        <Text as="div" size="2" mb="1" weight="bold">
                                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                                        </Text>
                                                                        <TextField.Root name={key} value={value || ''} placeholder={`Entrer ${key}`} onChange={handleEditChange} onPointerDown={(e) => e.stopPropagation()} />
                                                                    </label>
                                                                );
                                                            })}

                                                        </Flex>

                                                        <Flex gap="3" mt="4" justify="end">
                                                            <Dialog.Close>
                                                                <Button variant="soft" color="gray">{t('buttons.cancel')}</Button>
                                                            </Dialog.Close>
                                                            <Button onClick={handleEditSave}>{t('buttons.save')}</Button>
                                                        </Flex>
                                                    </Dialog.Content>
                                                </Dialog.Root>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item onClick={() => onInsertClient(client)}>
                                                <Flex align={"center"} gap={"2"} justify={"between"} width={"100%"}>
                                                    <Text>{t('buttons.insert')}</Text>
                                                    <FileInput size={16} />
                                                </Flex>
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Separator />
                                            <DropdownMenu.Item onClick={() => toggleBookmark(client.email)} color={client.bookmarks ? 'gold' : 'gray'}>
                                                <Flex align={"center"} gap={"2"} justify={"between"} width={"100%"}>
                                                    <Text>{client.bookmarks ? `${t('buttons.bookmark.remove')}` : `${t('buttons.bookmark.add')}`}</Text>
                                                    <SparklesIcon size={16} />
                                                </Flex>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                            <DropdownMenu.Item color="red">
                                                <AlertDialog.Root>
                                                    <AlertDialog.Trigger onClick={(e) => { e.stopPropagation() }}>
                                                        <Flex align={"center"} gap={"2"} justify={"between"} width={"100%"}>
                                                            <Text>{t('buttons.delete')}</Text>
                                                            <DeleteIcon size={16} />
                                                        </Flex>
                                                    </AlertDialog.Trigger>
                                                    <AlertDialog.Content maxWidth="450px" >
                                                        <AlertDialog.Title>{t('popup.remove.client.title')}</AlertDialog.Title>
                                                        <AlertDialog.Description size="2">
                                                            {t('popup.remove.client.description')}
                                                        </AlertDialog.Description>
                                                        <Flex gap="3" mt="4" justify="end">
                                                            <AlertDialog.Cancel>
                                                                <Button variant="soft" color="gray">{t('buttons.cancel')}</Button>
                                                            </AlertDialog.Cancel>
                                                            <AlertDialog.Action>
                                                                <Button variant="solid" color="red" onClick={() => onDeleteClient(client.email)}>
                                                                    {t('buttons.delete')}
                                                                </Button>
                                                            </AlertDialog.Action>
                                                        </Flex>
                                                    </AlertDialog.Content>
                                                </AlertDialog.Root>
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                    <HoverCard.Root>
                                        <HoverCard.Trigger>
                                            <BookUser size={"20"} strokeWidth={2} color='gray' />
                                        </HoverCard.Trigger>

                                        <HoverCard.Content width="fitcontent">
                                            <Flex direction={"column"}>
                                                <Text size={"3"} weight="bold">{client.companyName}</Text>
                                                <Separator my="2" size="4" />
                                                <Text size={"2"} color={"gray"}>{client.address}</Text>
                                                <Text size={"2"} color={"gray"}>{client.email}</Text>
                                                <Text size={"2"} color={"gray"}>{client.phone}</Text>
                                            </Flex>
                                        </HoverCard.Content>
                                    </HoverCard.Root>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </Flex >
            ) : (
                <Callout.Root >
                    <Callout.Icon><InfoCircledIcon /></Callout.Icon>
                    <Callout.Text>{t('informations.client.nocustomer')}</Callout.Text>
                </Callout.Root>
            )
            }

        </Box >

    );
};

export default ClientsList;

