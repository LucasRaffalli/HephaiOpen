import React, { createContext } from 'react';
import { DateProvider, useDateContext } from '@/context/DateContext';
import { PaymentProvider, usePaymentContext } from '@/context/PaymentContext';
import { DynamicTableProvider, useDynamicTableContext } from '@/context/DynamicTableContext';
import { ModalitiesProvider, useModalities } from '@/context/ModalitiesContext';
import { CommentsProvider, useComments } from '@/context/CommentsContext';
import { FooterProvider, useFooter } from '@/context/FooterContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { PDFProvider } from '@/context/PDFContext';

interface HephaiContextType {
    // Date
    selectedDate: string;
    isAutoDate: boolean;
    setIsAutoDate: (value: boolean) => void;
    setSelectedDate: (date: string) => void;

    // Payment
    paymentData: {
        iban: string;
        paypal: string;
        other: string;
    };
    selectedField: string | null;
    errors: Record<string, string>;
    handleFieldSelect: (field: string) => void;
    handleInputChange: (field: string, value: string) => void;

    // DynamicTable
    columns: Array<{ dataKey: string; header: string }>;
    rows: any[];
    maxColumns: number;
    addColumn: () => void;
    removeColumn: (index: number) => void;
    handleEditColumn: (index: number, value: string) => void;
    addRow: (row: any) => void;
    editRow: (index: number, row: any) => void;
    removeRow: (index: number) => void;
    clearRows: () => void;

    // Modalities
    text1: string;
    text2: string;
    isModalitiesEnabled: boolean;
    updateModalitiesText: (type: "text1" | "text2", value: string) => void;
    toggleModalities: () => void;

    // Comments
    commentsText: string;
    isCommentsEnabled: boolean;
    updateCommentsText: (value: string) => void;
    toggleComments: () => void;

    // Footer
    isFooterEnabled: boolean;
    setIsFooterEnabled: (value: boolean) => void;

    // Theme
    isDarkMode: boolean;
    accentColor: string;
    toggleTheme: (mode?: 'light' | 'dark' | 'system') => void;
    setAccentColor: (color: string) => void;
}

const HephaiContext = createContext<HephaiContextType | null>(null);


export const HephaiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <DateProvider>
                <PaymentProvider>
                    <DynamicTableProvider>
                        <ModalitiesProvider>
                            <CommentsProvider>
                                <FooterProvider>
                                    <PDFProvider>
                                        {children}
                                    </PDFProvider>
                                </FooterProvider>
                            </CommentsProvider>
                        </ModalitiesProvider>
                    </DynamicTableProvider>
                </PaymentProvider>
            </DateProvider>
        </ThemeProvider>
    );
};

export const useHephaiContext = () => {
    const dateContext = useDateContext();
    const paymentContext = usePaymentContext();
    const dynamicTableContext = useDynamicTableContext();
    const modalitiesContext = useModalities();
    const commentsContext = useComments();
    const footerContext = useFooter();
    const themeContext = useTheme();

    return {
        ...dateContext,
        ...paymentContext,
        ...dynamicTableContext,
        ...modalitiesContext,
        ...commentsContext,
        ...footerContext,
        ...themeContext
    };
};