import React, { createContext, useContext, useState } from 'react';

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
        setErrors(prev => ({
            ...prev,
            [field]: errorMessage,
        }));
        return errorMessage === '';
    };

    const handleFieldSelect = (field: string) => {
        setSelectedField(field);
    };

    const handleInputChange = (field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value,
        }));
        validateField(field, value);
    };

    return (
        <PaymentContext.Provider value={{
            paymentData,
            selectedField,
            errors,
            handleFieldSelect,
            handleInputChange,
        }}>
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