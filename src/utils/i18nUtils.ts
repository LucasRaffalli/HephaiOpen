export const getAvailableLanguages = (): string[] => {
    const languageModules = import.meta.glob('/src/lang/*.json', { eager: true });
    return Object.keys(languageModules).map(path => {
        const match = path.match(/\/(\w+)\.json$/);
        return match ? match[1] : '';
    }).filter(Boolean);
};
