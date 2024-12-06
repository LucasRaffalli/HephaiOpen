
import { Box, Button, TextField, Tooltip, Text, Flex } from '@radix-ui/themes';
import { t } from 'i18next';
import React from 'react';

interface UserInformationProps {
    companyInfo: Record<string, any>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    boxWidth?: string; 
    flexJustify?: 'start' | 'end' | 'center' | 'between';
}

const UserInformation: React.FC<UserInformationProps> = ({ companyInfo, handleChange, handleSave, boxWidth = '250px', flexJustify = 'start', }) => {
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
                    />
                </Box>
            ))}
            <Tooltip content={t('utils.tooltips.savedata')}>
                <Button variant="soft" className='btncursor' size={'3'} onClick={handleSave}>
                    <Text size="2" weight={'regular'}>{t('utils.savedata')}</Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default UserInformation;
