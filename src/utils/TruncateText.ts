export function truncateText(text: string, maxLength: number): string {
    return text.trim().length > maxLength ? text.trim().slice(0, maxLength) + '…' : text.trim();
}