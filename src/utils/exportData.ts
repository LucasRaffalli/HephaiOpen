import { saveAs } from 'file-saver';

export function exportData(data: any[], format: 'json' | 'csv') {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const timestamp = `${day}_${month}_${year}`;
    const sanitizedFileName = `${'Hephai'}_${timestamp}`;

    if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `${sanitizedFileName}.json`);
    } else if (format === 'csv') {
        const csvString = dataToCSV(data);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${sanitizedFileName}.csv`);
    }
}

function dataToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0])
        .map(header => escapeCSV(header))
        .join(',');

    const rows = data.map(row =>
        Object.values(row)
            .map(value => escapeCSV(value))
            .join(',')
    );

    return [headers, ...rows].join('\n');
}


function escapeCSV(value: any): string {
    if (typeof value !== 'string') value = String(value);
    if (/[,"\n]/.test(value)) {
        value = value.replace(/"/g, '""');
        return `"${value}"`;
    }
    return value;
}
