import React from 'react';
import { Flex, Box, TextField, Text, Tooltip } from '@radix-ui/themes';
import { t } from 'i18next';
import { usePaymentContext } from '@/context/PaymentContext';

interface PaymentSelectionProps {
    onPaymentChange?: (type: string, value: string) => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({ onPaymentChange }) => {
    const { paymentData, selectedField, errors, handleFieldSelect, handleInputChange } = usePaymentContext();

    const handleChange = (field: string, value: string) => {
        handleInputChange(field, value);
        if (onPaymentChange) {
            onPaymentChange(field, value);
        }
    };

    return (
        <Flex direction="column" gap="3" width="100%" justify="start">
            <Tooltip content={t('utils.tooltips.payment.iban')} side="right">
                <Box>
                    <TextField.Root value={paymentData.iban} placeholder={t('features.invoice.paymentMethods.ibanPlaceholder')} size="2" onClick={() => handleFieldSelect('iban')} onChange={(e) => handleChange('iban', e.target.value)} style={{ opacity: selectedField === 'iban' || selectedField === null ? 1 : 0.5, borderColor: selectedField === 'iban' ? 'var(--accent-9)' : undefined, boxShadow: selectedField === 'iban' ? '0 0 0 1px var(--accent-9)' : undefined }} className='btnCursor' />
                    {errors.iban && <Text color="red">{errors.iban}</Text>}
                </Box>
            </Tooltip>
            <Tooltip content={t('utils.tooltips.payment.paypal')} side="right">
                <Box>
                    <TextField.Root value={paymentData.paypal} placeholder={t('features.invoice.paymentMethods.paypalPlaceholder')} size="2" onClick={() => handleFieldSelect('paypal')} onChange={(e) => handleChange('paypal', e.target.value)} style={{ opacity: selectedField === 'paypal' || selectedField === null ? 1 : 0.5, borderColor: selectedField === 'paypal' ? 'var(--accent-9)' : undefined, boxShadow: selectedField === 'paypal' ? '0 0 0 1px var(--accent-9)' : undefined }} className='btnCursor' />
                    {errors.paypal && <Text color="red">{errors.paypal}</Text>}
                </Box>
            </Tooltip>
            <Tooltip content={t('utils.tooltips.payment.other')} side="right">
                <Box>
                    <TextField.Root value={paymentData.other} placeholder={t('features.invoice.paymentMethods.otherPlaceholder')} size="2" onClick={() => handleFieldSelect('other')} onChange={(e) => handleChange('other', e.target.value)} style={{ opacity: selectedField === 'other' || selectedField === null ? 1 : 0.5, borderColor: selectedField === 'other' ? 'var(--accent-9)' : undefined, boxShadow: selectedField === 'other' ? '0 0 0 1px var(--accent-9)' : undefined }} className='btnCursor' />
                </Box>
            </Tooltip>
        </Flex>
    );
};

export default PaymentSelection;
