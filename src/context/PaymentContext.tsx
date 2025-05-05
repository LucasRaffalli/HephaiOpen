import React, { createContext, useContext, useState } from 'react';
import { ibanFormats } from '@/types/hephai';
import { t } from 'i18next';

interface PaymentContextType {
    paymentData: {
        iban: string;
        paypal: string;
        other: string;
    };
    selectedField: string | null;
    errors: {
        iban: string;
        paypal: string;
        other: string;
    };
    handleFieldSelect: (field: string) => void;
    handleInputChange: (field: string, value: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        iban: /^[A-Z]{2}\d+$/,
        paypal: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };

    const validateIBAN = (iban: string): string => {
        if (!iban) return '';

        const countryCode = iban.substring(0, 2).toUpperCase();
        const format = ibanFormats[countryCode];

        if (!format) {
            return t('errors.payment.unknownCountryCode');
        }

        if (iban.length !== format.length) {
            return t('errors.payment.ibanLength', {
                countryCode,
                length: format.length,
                current: iban.length
            });
        }

        if (!format.regex.test(iban)) {
            return t('errors.payment.invalidIbanFormat', { countryCode });
        }

        return '';
    };

    const validateField = (field: string, value: string) => {
        let errorMessage = '';
        if (field === 'iban') {
            errorMessage = validateIBAN(value);
        } else if (field === 'paypal' && value && !regexRules.paypal.test(value)) {
            errorMessage = t('errors.payment.invalidPaypalAddress');
        }

        setErrors(prev => ({
            ...prev,
            [field]: errorMessage,
        }));
        return errorMessage === '';
    };

    const handleFieldSelect = (field: string) => {
        setSelectedField(field);
        setPaymentData(prev => ({
            iban: field === 'iban' ? prev.iban : '',
            paypal: field === 'paypal' ? prev.paypal : '',
            other: field === 'other' ? prev.other : '',
        }));
        setErrors(prev => ({
            iban: field === 'iban' ? prev.iban : '',
            paypal: field === 'paypal' ? prev.paypal : '',
            other: field === 'other' ? prev.other : '',
        }));
    };

    const handleInputChange = (field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value,
        }));
        validateField(field, value);
    };

    return (
        <PaymentContext.Provider value={{ paymentData, selectedField, errors, handleFieldSelect, handleInputChange, }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePaymentContext must be used within a PaymentProvider');
    }
    return context;
};