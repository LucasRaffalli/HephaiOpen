import { useEffect, useState } from "react";

export const useDynamicTable = () => {
    const [columns, setColumns] = useState(() => {
        const savedData = localStorage.getItem("invoiceData");
        return savedData ? JSON.parse(savedData).dynamicColumns || [] : [];
    });

    const [rows, setRows] = useState(() => {
        const savedData = localStorage.getItem("invoiceData");
        return savedData ? JSON.parse(savedData).rows : [];
    });

    useEffect(() => {
        localStorage.setItem("invoiceData", JSON.stringify({ columns, rows }));
    }, [columns, rows]);

    const addColumn = () => {
        const newColumn = {
            header: `Colonne ${columns.length + 1}`,
            dataKey: `col${columns.length + 1}`,
        };
        setColumns([...columns, newColumn]);
        setRows(rows.map((row: { [x: string]: any; }) => ({ ...row, [newColumn.dataKey]: "" })));
    };

    const removeColumn = (index: number) => {
        if (!Array.isArray(columns) || index < 0 || index >= columns.length) {
            console.error(`Invalid index ${index}. Columns:`, columns);
            return;
        }

        const columnToRemove = columns[index].dataKey;
        setColumns(columns.filter((_, i) => i !== index));
        setRows(rows.map((row: { [x: string]: any; }) => {
            const { [columnToRemove]: _, ...rest } = row;
            return rest;
        }));
    };

    return { columns, rows, setRows, addColumn, removeColumn };
};
