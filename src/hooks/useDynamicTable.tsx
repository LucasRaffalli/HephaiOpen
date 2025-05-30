import { useEffect, useState } from "react";
import { generateUniqueId } from "@/utils/generateId";

interface Column {
    dataKey: string;
    header: string;
}

export const useDynamicTable = () => {
    const [columns, setColumns] = useState<Column[]>(() => {
        const savedData = localStorage.getItem("invoiceData");
        const savedColumns = savedData ? JSON.parse(savedData).columns || [] : [];
        return savedColumns.filter((col: Column) => col.header.trim() !== "");
    });

    const [rows, setRows] = useState(() => {
        const savedData = localStorage.getItem("invoiceData");
        return savedData ? JSON.parse(savedData).rows || [] : [];
    });

    useEffect(() => {
        const cleanedRows = rows.map((row: Record<string, any>) => {
            const cleanedRow: Record<string, any> = {
                product: row.product,
                total: row.total
            };

            columns.forEach((col) => {
                if (row[col.dataKey] !== undefined) {
                    cleanedRow[col.dataKey] = row[col.dataKey];
                }
            });

            return cleanedRow;
        });

        localStorage.setItem("invoiceData", JSON.stringify({
            columns,
            rows: cleanedRows
        }));
    }, [columns, rows]);

    const addColumn = () => {
        const newColumn = {
            header: `Colonne ${columns.length + 1}`,
            dataKey: `col-${generateUniqueId()}`,
        };
        setColumns([...columns, newColumn]);
        setRows(rows.map((row: Record<string, any>) => ({
            ...row,
            [newColumn.dataKey]: ""
        })));
    };

    const removeColumn = (index: number) => {
        if (!Array.isArray(columns) || index < 0 || index >= columns.length) {
            console.error(`Invalid index ${index}. Columns:`, columns);
            return;
        }

        const columnToRemove = columns[index].dataKey;
        setColumns(columns.filter((_, i) => i !== index));

        setRows(rows.map((row: Record<string, any>) => {
            const { [columnToRemove]: _, ...rest } = row;
            return rest;
        }));
    };

    const handleEditColumn = (index: number, value: string) => {
        const updatedColumns = [...columns];
        if (updatedColumns[index]) {
            updatedColumns[index].header = value;
            setColumns(updatedColumns);
        }
    };

    return {
        columns,
        setColumns,
        rows,
        setRows,
        addColumn,
        removeColumn,
        handleEditColumn
    };
};
