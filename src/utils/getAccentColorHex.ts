import { AccentColor } from '@/types/hephai';

export const colorMap: Record<AccentColor, string> = {
    [AccentColor.Tomato]: 'E54D2E',
    [AccentColor.Red]: 'E5484D',
    [AccentColor.Ruby]: 'E54666',
    [AccentColor.Pink]: 'D6409F',
    [AccentColor.Plum]: 'AB4ABA',
    [AccentColor.Purple]: '8E4EC6',
    [AccentColor.Violet]: '6E56CF',
    [AccentColor.Iris]: '5B5BD6',
    [AccentColor.Indigo]: '3E63DD',
    [AccentColor.Blue]: '0090FF',
    [AccentColor.Cyan]: '00A2C7',
    [AccentColor.Teal]: '12A594',
    [AccentColor.Jade]: '29A383',
    [AccentColor.Green]: '30A46C',
    [AccentColor.Grass]: '46A758',
    [AccentColor.Orange]: 'F76B15',
    [AccentColor.Brown]: 'AD7F58',
    [AccentColor.Gold]: '978365',
    [AccentColor.Bronze]: 'A18072',
    [AccentColor.Gray]: '8D8D8D',
    [AccentColor.Sky]: '7CE2FE',
    [AccentColor.Mint]: '86EAD4',
    [AccentColor.Lime]: 'BDEE63',
    [AccentColor.Yellow]: 'FFE629',
    [AccentColor.Amber]: 'FFC53D',
};

export function getAccentColorHex(): string {
    const storedAccentColor = localStorage.getItem('accentColor') as AccentColor;
    return `#${colorMap[storedAccentColor] || '0090FF'}`;
}