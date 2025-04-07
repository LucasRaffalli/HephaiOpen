import React, { useState } from 'react';
import { Flex, Box, TextField, Button, Text, Tooltip } from '@radix-ui/themes';
import { t } from 'i18next';

interface PaymentSelectionProps {
    onPaymentChange?: (type: string, value: string) => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({ onPaymentChange }) => {
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState({
        iban: '',
        paypal: '',
        other: '',
    });
    const [errors, setErrors] = useState({
        iban: '',
        paypal: '',
        other: '',
    });

    const regexRules = {
        iban: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,
        paypal: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };

    const validateField = (field: string, value: string) => {
        let errorMessage = '';
        if (field === 'iban' && value && !regexRules.iban.test(value)) {
            errorMessage = 'IBAN invalide. Exemple : FR7630001007941234567890185';
        } else if (field === 'paypal' && value && !regexRules.paypal.test(value)) {
            errorMessage = 'Adresse PayPal invalide. Exemple : exemple@email.com';
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: errorMessage,
        }));
        return errorMessage === '';
    };

    const handleFieldSelect = (field: string) => {
        setSelectedField(field);
    };

    const handleInputChange = (field: string, value: string) => {
        setPaymentData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
        if (onPaymentChange) {
            onPaymentChange(field, value);
        }
        validateField(field, value);
    };

    return (
        <Flex direction="column" gap="3" width="100%" justify="start">
            <Tooltip content={t('utils.tooltips.payment.iban')}>
                <Box>

                    <TextField.Root value={paymentData.iban} placeholder={t('features.invoice.paymentMethods.ibanPlaceholder')} size="2" onClick={() => handleFieldSelect('iban')} onChange={(e) => handleInputChange('iban', e.target.value)} style={{ opacity: selectedField === 'iban' || selectedField === null ? 1 : 0.5, cursor: 'pointer', }} />
                    {errors.iban && <Text color="red">{errors.iban}</Text>}
                </Box>
            </Tooltip>
            <Tooltip content={t('utils.tooltips.payment.paypal')}>
                <Box>
                    <TextField.Root value={paymentData.paypal} placeholder={t('features.invoice.paymentMethods.paypalPlaceholder')} size="2" onClick={() => handleFieldSelect('paypal')} onChange={(e) => handleInputChange('paypal', e.target.value)} style={{ opacity: selectedField === 'paypal' || selectedField === null ? 1 : 0.5, cursor: 'pointer', }} />
                    {errors.paypal && <Text color="red">{errors.paypal}</Text>}
                </Box>
            </Tooltip>
            <Tooltip content={t('utils.tooltips.payment.other')}>
                <Box>
                    <TextField.Root value={paymentData.other} placeholder={t('features.invoice.paymentMethods.otherPlaceholder')} size="2" onClick={() => handleFieldSelect('other')} onChange={(e) => handleInputChange('other', e.target.value)} style={{ opacity: selectedField === 'other' || selectedField === null ? 1 : 0.5, cursor: 'pointer', }} />
                </Box>
            </Tooltip>
        </Flex >
    );
};

export default PaymentSelection;
