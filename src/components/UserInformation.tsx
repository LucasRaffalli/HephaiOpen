import { Box, Button, TextField, Tooltip, Text, Flex, IconButton } from '@radix-ui/themes';
import { t } from 'i18next';
import React, { useState, useEffect } from 'react';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

interface UserInformationProps {
    companyInfo: Record<string, any>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    boxWidth?: string;
    flexJustify?: 'start' | 'end' | 'center' | 'between';
}

const UserInformation: React.FC<UserInformationProps> = ({ companyInfo, handleChange, handleSave, boxWidth = '250px', flexJustify = 'start', }) => {
    const [visibility, setVisibility] = useState<Record<string, boolean>>(JSON.parse(localStorage.getItem('visibilityPreferences') || '{}'));

    useEffect(() => {
        localStorage.setItem('visibilityPreferences', JSON.stringify(visibility));
    }, [visibility]);

    const toggleVisibility = (field: string) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <Flex direction={'row'} gap={'3'} width={'100%'} height={'fit-content'} wrap={'wrap'} justify={flexJustify}>
            {Object.entries(companyInfo).map(([key, value]) => (
                <Box key={key} width={boxWidth} mb="0">
                    <TextField.Root
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        name={key}
                        onChange={handleChange}
                        value={value}
                        size="2"
                        type={visibility[key] ? 'text' : 'password'}
                    >
                        <TextField.Slot side="right">
                            <IconButton onClick={() => toggleVisibility(key)} variant="ghost" size="1">
                                {visibility[key] ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </IconButton>
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            ))}
            <Tooltip content={t('utils.tooltips.savedata')}>
                <Button variant="soft" className='btncursor' size={'3'} onClick={handleSave}>
                    <Text size="2" weight={'regular'}>{t('buttons.data.save')}</Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default UserInformation;
