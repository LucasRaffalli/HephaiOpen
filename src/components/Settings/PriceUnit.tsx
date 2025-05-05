import React, { useState } from 'react';
import { Flex, Select } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { PriceUnit as PriceUnitEnum } from '@/types/hephai';

interface PriceUnitProps {
    className?: string;
}

const PriceUnit: React.FC<PriceUnitProps> = ({ className = '' }) => {
    const { t } = useTranslation();
    const [selectedUnit, setSelectedUnit] = useState<PriceUnitEnum>(
        (localStorage.getItem('priceUnit') as PriceUnitEnum) || PriceUnitEnum.EUR
    );

    const handlePriceUnitChange = (value: string) => {
        const currency = value as PriceUnitEnum;
        setSelectedUnit(currency);
        localStorage.setItem('priceUnit', currency);
    };

    return (
        <Flex className={className}>
            <Select.Root value={selectedUnit} onValueChange={handlePriceUnitChange}>
                <Select.Trigger />
                <Select.Content position='popper'>
                    {Object.entries(PriceUnitEnum).map(([key, value]) => (
                        <Select.Item key={key} value={value} className="btnCursor">
                            {t(`settings.priceUnit.${key.toLowerCase()}`)} ({value})
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Flex>
    );
};

export default PriceUnit;