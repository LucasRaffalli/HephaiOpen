export const generateUniqueId = (): string => {
    const timestamp = Date.now().toString(36); // Base 36 pour compacter le timestamp
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 caractères aléatoires
    return `${timestamp}-${randomSuffix}`;
};

