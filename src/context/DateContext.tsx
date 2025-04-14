import React, { createContext, useContext, useState, useEffect } from 'react';

interface DateContextType {
    selectedDate: string;
    isAutoDate: boolean;
    setSelectedDate: (date: string) => void;
    setIsAutoDate: (value: boolean) => void;
    handleCustomDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);

    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAutoDate(false);
        setSelectedDate(e?.target.value);
    };

    useEffect(() => {
        if (isAutoDate) {
            const updateDate = () => {
                const today = new Date();
                setSelectedDate(today.toISOString().split('T')[0]);
            };
            updateDate();
            const intervalId = setInterval(updateDate, 1000);
            return () => clearInterval(intervalId);
        }
    }, [isAutoDate]);

    return (
        <DateContext.Provider value={{
            selectedDate,
            isAutoDate,
            setSelectedDate,
            setIsAutoDate,
            handleCustomDate
        }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDateContext = () => {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
};