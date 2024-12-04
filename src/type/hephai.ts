export interface ThemeContextType {
    isDarkMode: boolean;
    accentColor: string;
    toggleTheme: (mode?: 'light' | 'dark' | 'system') => void;
    setAccentColor: (color: string) => void;
    // accentColorHex: string;
}
export interface SettingsSchema {
    isDarkMode: boolean;
    accentColor: string;
}

export interface CompanyInfo {
    authorCompanyName: string;
    authorAddress: string;
    authorPhone: string;
    authorEmail: string;
    siret: string;
}

export interface IconProperties {
    size: number;
    color?: string;
    fill?: string;
    className?: string;
}

export enum AccentColor {
    Tomato = 'tomato',
    Red = 'red',
    Ruby = 'ruby',
    // Crimson = 'Crimson',
    Pink = 'pink',
    Plum = 'plum',
    Purple = 'purple',
    Violet = 'violet',
    Iris = 'iris',
    Indigo = 'indigo',
    Blue = 'blue',
    Cyan = 'cyan',
    Teal = 'teal',
    Jade = 'jade',
    Green = 'green',
    Grass = 'grass',
    Orange = 'orange',
    Brown = 'brown',
    Gold = 'gold',
    Bronze = 'bronze',
    Gray = 'gray',
    Sky = 'sky',
    Mint = 'mint',
    Lime = 'lime',
    Yellow = 'yellow',
    Amber = 'amber',

}

