import React, { createContext, useContext, ReactNode } from 'react';
import { useDynamicTable } from '@/hooks/useDynamicTable';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { useDarkMode } from '@/hooks/useDarkMode';

interface Column {
    dataKey: string;
    header: string;
}

interface DynamicTableContextProps {
    columns: Column[];
    rows: Record<string, any>[];
    addColumn: () => void;
    removeColumn: (index: number) => void;
    handleEditColumn: (index: number, value: string) => void;
    addRow: (row: Record<string, any>) => void;
    removeRow: (index: number) => void;
    editRow: (index: number, key: string, value: string) => void;
    clearRows: () => void;
    maxColumns: number;
}

const DynamicTableContext = createContext<DynamicTableContextProps | undefined>(undefined);

export const DynamicTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode] = useDarkMode();
    const { columns, rows, setRows, addColumn: addColumnBase, removeColumn,setColumns } = useDynamicTable();
    const maxColumns = 4;

    const handleEditColumn = (index: number, value: string) => {
        const updatedColumns = [...columns];
        if (updatedColumns[index]) {
            updatedColumns[index].header = value;
            setColumns(updatedColumns);
        }
    };

    const addColumn = () => {
        if (columns.length >= maxColumns) {
            toast.error(t('toast.columns.maxReached'), {
                theme: isDarkMode ? 'dark' : 'light'
            });
            return;
        }
        addColumnBase();
    };

    const addRow = (newRow: Record<string, any>) => {
        setRows([...rows, newRow]);
    };

    const removeRow = (index: number) => {
        const updatedRows = rows.filter((_: any, i: any) => i !== index);
        setRows(updatedRows);
    };

    const editRow = (index: number, key: string, value: string) => {
        const updatedRows = [...rows];
        if (updatedRows[index]) {
            updatedRows[index][key] = value;
            setRows(updatedRows);
        }
    };

    const clearRows = () => {
        setRows([]);
    };

    return (
        <DynamicTableContext.Provider value={{
            columns,
            rows,
            addColumn,
            removeColumn,
            handleEditColumn,
            addRow,
            removeRow,
            editRow,
            clearRows,
            maxColumns
        }}>
            {children}
        </DynamicTableContext.Provider>
    );
};

export const useDynamicTableContext = () => {
    const context = useContext(DynamicTableContext);
    if (!context) {
        throw new Error('useDynamicTableContext must be used within a DynamicTableProvider');
    }
    return context;
};