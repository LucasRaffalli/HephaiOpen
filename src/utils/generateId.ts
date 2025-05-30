export const generateUniqueId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomSuffix}`;
};

