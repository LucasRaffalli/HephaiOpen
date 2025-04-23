
import { Box, TextField, Tooltip, Text, Flex } from '@radix-ui/themes';
import { t } from 'i18next';
import React, { useState } from 'react';

interface TvaProps {
    boxWidth?: string;
    flexJustify?: 'start' | 'end' | 'center' | 'between';
    valueTva: any;
}

const Tva: React.FC<TvaProps> = ({ boxWidth = '230px', flexJustify = 'start' }) => {
    const [tva, setTva] = useState(localStorage.getItem('tva') || '0');

    const handleTvaChange = (newTva: string) => {
        const tvaValue = newTva ? parseFloat(newTva) : 0;
        setTva(tvaValue.toString());
        localStorage.setItem('tva', tvaValue.toString());
    };


    return (
        <Flex direction={'row'} gap={'4'} minWidth={'20%'} maxWidth={'50%'} height={'fit-content'}>
            <Tooltip content={t('utils.tooltips.vat')}>
                <Box width={"70px"}>

                    <TextField.Root type="number" value={tva} max={"100"} onChange={(e) => handleTvaChange(e.target.value)} placeholder="20" aria-label={t('settings.tva.placeholder' + "%")}>
                        <TextField.Slot side="right">
                            <Text>%</Text>
                        </TextField.Slot>

                    </TextField.Root>

                </Box>
            </Tooltip>
        </Flex>
    );
};

export default Tva;