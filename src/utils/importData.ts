

export async function importData(file: File): Promise<any[]> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'json') {
        return await importJSON(file);
    } else if (fileExtension === 'csv') {
        return await importCSV(file);
    } else {
        throw new Error('Format de fichier non pris en charge. Utilisez un fichier JSON ou CSV.');
    }
}

async function importJSON(file: File): Promise<any[]> {
    const text = await file.text();
    return JSON.parse(text);
}

async function importCSV(file: File): Promise<any[]> {
    const text = await file.text();
    const [headerLine, ...lines] = text.split('\n').filter(line => line.trim() !== '');
    const headers = headerLine.split(',').map(header => header.trim());

    return lines.map(line => {
        const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {} as Record<string, any>);
    });
}
