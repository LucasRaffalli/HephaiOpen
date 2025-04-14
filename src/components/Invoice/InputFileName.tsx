import { TextField } from '@radix-ui/themes';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePDF } from '@/context/PDFContext';
interface InputFileNameProps {
    width?: string | number;
    height?: string | number;
}
export default function InputFileName({ width = '', height = '' }: InputFileNameProps) {
    const { t } = useTranslation();
    const { pdfDoc } = usePDF();
    const [customPrefix, setCustomPrefix] = useState<string>('');

    useEffect(() => {
        const savedPrefix = localStorage.getItem('customFileNamePrefix');
        if (savedPrefix) {
            setCustomPrefix(savedPrefix);
        } else {
            const defaultPrefix = t('features.invoice.filenamePrefix');
            setCustomPrefix(defaultPrefix);
            localStorage.setItem('customFileNamePrefix', defaultPrefix);
        }
    }, [t]);

    // Optimiser la gestion des changements avec useCallback
    const handlePrefixChange = useCallback((value: string) => {
        const cleanedValue = value.replace(/[^a-zA-Z0-9-_]/g, '');
        setCustomPrefix(cleanedValue);
        localStorage.setItem('customFileNamePrefix', cleanedValue);
    }, []);

    // Se mettre à jour quand le PDF change
    useEffect(() => {
        if (pdfDoc) {
            const savedPrefix = localStorage.getItem('customFileNamePrefix');
            if (savedPrefix) {
                setCustomPrefix(savedPrefix);
            }
        }
    }, [pdfDoc]);

    return (
        <TextField.Root
            placeholder={t('features.invoice.filenamePrefix')}
            value={customPrefix}
            onChange={(e) => handlePrefixChange(e.target.value)}
            maxLength={20}
            style={{ width, height }}
        />
    );
}
