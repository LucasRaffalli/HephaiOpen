import { saveAs } from 'file-saver'; // Utilisez 'file-saver' pour faciliter le téléchargement des fichiers

export function exportData(data: any[], format: 'json' | 'csv') {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Ajouter un 0 devant les jours < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajouter un 0 devant les mois < 10
    const year = date.getFullYear();
    const timestamp = `${day}_${month}_${year}`; // Format: jour_mois_année
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

// Fonction utilitaire pour convertir les données en CSV
function dataToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0])
        .map(header => escapeCSV(header))
        .join(','); // Les en-têtes du CSV avec échappement

    const rows = data.map(row =>
        Object.values(row)
            .map(value => escapeCSV(value)) // Échapper chaque valeur
            .join(',')
    );

    return [headers, ...rows].join('\n'); // Concaténer les en-têtes et les lignes
}

// Fonction utilitaire pour échapper les valeurs CSV (ex : valeurs contenant des virgules, guillemets, ou retours à la ligne)
function escapeCSV(value: any): string {
    if (typeof value !== 'string') value = String(value); // Convertir en string si nécessaire
    if (/[,"\n]/.test(value)) { // Vérifie la présence de caractères spéciaux
        value = value.replace(/"/g, '""'); // Échappe les guillemets en doublant
        return `"${value}"`; // Encadre la valeur de guillemets
    }
    return value;
}
