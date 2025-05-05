import React from 'react';
import { Box, TextField, Text, Flex, Button, Switch, IconButton, Tooltip } from '@radix-ui/themes';
import { useClientContext } from './ClientContext';
import { Eye, EyeClosed, PlusIcon } from 'lucide-react';
import { t } from 'i18next';

interface ClientFormProps {
    boxWidth?: string;
    flexJustify?: 'start' | 'end' | 'center' | 'between';
}

const ClientForm: React.FC<ClientFormProps> = ({ flexJustify = 'start', boxWidth = '240px' }) => {
    const { selectedClient, handleChange, handleAddClient, visibility, handleToggleVisibility } = useClientContext();

    const clientData = selectedClient || { bookmarks: false, companyName: '', address: '', email: '', phone: '', };

    return (
        <Flex direction="column" gap="3" width="100%" height="fit-content">
            <Flex direction="row" gap="3" wrap="wrap" justify={flexJustify}>
                {Object.entries(clientData).map(([key, value]) => {
                    if (key === 'id') return null;
                    if (key === 'bookmarks') {
                        return (
                            <Box key={key} width={boxWidth} mb="0">
                                <Tooltip content={t(`utils.tooltips.${key}`)} side="right">
                                    <Flex align="center" gap="2">
                                        <Switch checked={value as boolean} onCheckedChange={(checked) => handleChange({ target: { name: 'bookmarks', value: checked, type: 'checkbox', checked } } as any)} />
                                        <Text size="2">{t('buttons.bookmark.base')}</Text>
                                    </Flex>
                                </Tooltip>
                            </Box>
                        );
                    }

                    return (
                        <Box key={key} width={boxWidth} mb="0">
                            <Tooltip content={t(`utils.tooltips.customer.${key}`)} side="right">
                                <TextField.Root placeholder={key.charAt(0).toUpperCase() + key.slice(1)} name={key} onChange={handleChange} value={value || ''} size="2" type={['email', 'phone', 'address'].includes(key) ? (visibility[key] ? 'text' : 'password') : 'text'}>
                                    {['email', 'phone', 'address'].includes(key) && (
                                        <TextField.Slot side="right">
                                            <IconButton onClick={() => handleToggleVisibility(key)} variant="ghost" size="1" className="btnCursor">
                                                {visibility[key] ? <Eye size={16} /> : <EyeClosed size={16} />}
                                            </IconButton>
                                        </TextField.Slot>
                                    )}
                                </TextField.Root>
                            </Tooltip>
                        </Box>
                    );
                })}
            </Flex>
            <Tooltip content={t('utils.tooltips.addClient')} side="right">
                <Button variant="soft" className='btnCursor' onClick={handleAddClient}>
                    <PlusIcon size={16} />
                    <Text size="2" weight="regular">{t('buttons.addClient')}</Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default ClientForm;
