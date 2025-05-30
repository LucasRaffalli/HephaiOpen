import { Flex, IconButton, TextField } from '@radix-ui/themes'
import { t } from 'i18next';
import { Stamp } from "lucide-react";
import React, { useState } from 'react'
import StampOff from '../design/icons/StampOff';
interface InvoiceCreditProps {
    onClick: () => void;
}
const CreditHephai: React.FC<InvoiceCreditProps> = ({ onClick }) => {
    const [isActive, setIsActive] = useState(false);
    const handleIconClick = () => { setIsActive((prev) => !prev); onClick(); };
    return (
        <Flex direction="column" width="100%" gap="3">
            <TextField.Root placeholder={t('utils.credit')} size="2" disabled>
                <TextField.Slot side={'right'} >
                    <IconButton onClick={() => handleIconClick()} variant="ghost" size={"1"} className='btnCursor'>
                        {isActive ? <StampOff height={16} width={16} /> : <Stamp size={16} />}
                    </IconButton>
                </TextField.Slot>
            </TextField.Root>

        </Flex>
    )
}

export default CreditHephai