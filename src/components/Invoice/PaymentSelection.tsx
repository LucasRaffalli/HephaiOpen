import React, { useState } from 'react';
import { Flex, Box, TextField, Button, Text } from '@radix-ui/themes';

interface PaymentSelectionProps {
    onPaymentChange?: (type: string, value: string) => void; // Callback optionnel pour envoyer les données sélectionnées
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({ onPaymentChange }) => {
    const [selectedField, setSelectedField] = useState<string | null>(null); // Champ actuellement sélectionné
    const [paymentData, setPaymentData] = useState({
        Iban: '',
        Paypal: '',
        Other: '',
    });
    const [errors, setErrors] = useState({
        Iban: '',
        Paypal: '',
        Other: '',
    });

    // Regex pour valider les champs
    const regexRules = {
        iban: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, // Format de base pour l'IBAN (2 lettres, 2 chiffres, suivi d'une chaîne alphanumérique)
        paypal: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email classique
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
        return errorMessage === ''; // Retourne vrai si pas d'erreur
    };

    const handleFieldSelect = (field: string) => {
        setSelectedField(field); // Définit le champ actif
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
            <Box>
                <TextField.Root
                    value={paymentData.Iban}
                    placeholder="IBAN"
                    size="2"
                    onClick={() => handleFieldSelect('iban')}
                    onChange={(e) => handleInputChange('iban', e.target.value)}
                    style={{
                        opacity: selectedField === 'iban' || selectedField === null ? 1 : 0.5,
                        cursor: 'pointer',
                    }}
                />
                {errors.Iban && <Text color="red">{errors.Iban}</Text>}
            </Box>
            <Box>
                <TextField.Root
                    value={paymentData.Paypal}
                    placeholder="PayPal"
                    size="2"
                    onClick={() => handleFieldSelect('paypal')}
                    onChange={(e) => handleInputChange('paypal', e.target.value)}
                    style={{
                        opacity: selectedField === 'paypal' || selectedField === null ? 1 : 0.5,
                        cursor: 'pointer',
                    }}
                />
                {errors.Paypal && <Text color="red">{errors.Paypal}</Text>}
            </Box>
            <Box>
                <TextField.Root
                    value={paymentData.Other}
                    placeholder="Autre"
                    size="2"
                    onClick={() => handleFieldSelect('other')}
                    onChange={(e) => handleInputChange('other', e.target.value)}
                    style={{
                        opacity: selectedField === 'other' || selectedField === null ? 1 : 0.5,
                        cursor: 'pointer',
                    }}
                />
            </Box>
        </Flex>
    );
};

export default PaymentSelection;
