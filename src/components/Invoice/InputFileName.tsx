import { useInvoicePDF } from '@/hooks/useInvoicePDF';
import { FileTextIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function InputFileName() {
    const { t } = useTranslation();
    const [customPrefix, setCustomPrefix] = useState<string>('');

    useEffect(() => {
        // Load saved prefix from localStorage if exists
        const savedPrefix = localStorage.getItem('customFileNamePrefix');
        if (savedPrefix) {
            setCustomPrefix(savedPrefix);
        }
    }, []);

    const handlePrefixChange = (value: string) => {
        // Nettoyer le préfixe pour éviter les caractères spéciaux
        const cleanedValue = value.replace(/[^a-zA-Z0-9-_]/g, '');
        setCustomPrefix(cleanedValue);
        localStorage.setItem('customFileNamePrefix', cleanedValue);
    };

    return (
        <TextField.Root
            placeholder={t('features.invoice.filenamePrefix')}
            value={customPrefix}
            onChange={(e) => handlePrefixChange(e.target.value)}
            maxLength={20}
            style={{ width: '120px' }}
        >
            <TextField.Slot>
                <FileTextIcon height="16" width="16" />
            </TextField.Slot>
        </TextField.Root>
    );
}
