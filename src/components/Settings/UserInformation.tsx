import { Box, Button, TextField, Tooltip, Text, Flex, IconButton } from '@radix-ui/themes';
import { t } from 'i18next';
import React from 'react';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

interface UserInformationProps {
    companyInfo: Record<string, any>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    boxWidth?: string;
    flexJustify?: 'start' | 'end' | 'center' | 'between';
    buttonSize?: string;
    visibility?: Record<string, boolean>;
    onToggleVisibility?: (field: string) => void;
}

const UserInformation: React.FC<UserInformationProps> = ({
    companyInfo,
    handleChange,
    handleSave,
    boxWidth = '230px',
    flexJustify = 'start',
    buttonSize = "100%",
    visibility = {},
    onToggleVisibility
}) => {
    return (
        <Flex direction={'row'} gap={'3'} width={'100%'} height={'fit-content'} wrap={'wrap'} justify={flexJustify}>
            {Object.entries(companyInfo).map(([key, value]) => (
                <Box key={key} width={boxWidth} mb="0">
                    <Tooltip content={t(`utils.tooltips.author.${key}`, key)}>

                        <TextField.Root placeholder={key.charAt(0).toUpperCase() + key.slice(1)} name={key} onChange={handleChange} value={value} size="2" type={visibility[key] ? 'text' : 'password'}>
                            <TextField.Slot side="right">
                                <IconButton onClick={() => onToggleVisibility?.(key)} variant="ghost" size="1">
                                    {visibility[key] ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </IconButton>
                            </TextField.Slot>
                        </TextField.Root>
                    </Tooltip>
                </Box>
            ))}
            <Tooltip content={t('utils.tooltips.savedata')}>
                <Button variant="soft" className='btncursor' size={'3'} onClick={handleSave} style={{ 'width': buttonSize }}>
                    <Text size="2" weight={'regular'}>{t('buttons.data.save')}</Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default UserInformation;
