export interface pdfViewsProps {
    pdfUrl: string;
    options?: OptionPdf;
}

export interface ThemeContextType {
    isDarkMode: boolean;
    accentColor: string;
    toggleTheme: (mode?: 'light' | 'dark' | 'system') => void;
    setAccentColor: (color: string) => void;
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
export interface Client {
    id: string;
    bookmarks: boolean;
    companyName: string;
    address: string;
    email: string;
    phone: string;
}
export interface IconProperties {
    size: number;
    color?: string;
    fill?: string;
    className?: string;
}

export interface PaymentInfo {
    type: "Iban" | "Cash" | "Cheque" | "Paypal" | string;
    details?: string;
    amountPaid: any;
}

export interface OptionPdf {
    clientInfo: Client;
    companyInfo: CompanyInfo;
    paymentInfo: PaymentInfo;
    rows: any[];
    columns: any[];
    selectedDate: string;
    imageSrc: string | null;
    priceUnit: string;
    modalitiesText1: string;
    modalitiesText2: string;
    commentsText: string;
    isCommentsEnabled: boolean;
    isModalitiesEnabled: boolean;
    isFooterEnabled: boolean;
    customFileNamePrefix?: string
}
export interface PdfMetadata {
    Title: string;
    Author: string;
    Subject: string;
    Keywords: string;

    Producer?: string;
    PDFFormatVersion?: string;
    PageSize?: string;
    Application?: string;
    Modified?: string;
    Created?: string;
}

export interface PDFInfo {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Producer?: string;
    ModDate?: string;
    CreationDate?: string;
    [key: string]: any;
}

export interface PageDimensions {
    width: number;
    height: number;
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

export const ibanFormats: { [key: string]: { length: number; regex: RegExp } } = {
    AT: { length: 20, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Autriche
    BE: { length: 16, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Belgique
    BG: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Bulgarie
    CY: { length: 28, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Chypre
    CZ: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // République Tchèque
    DE: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Allemagne
    DK: { length: 18, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Danemark
    EE: { length: 20, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Estonie
    ES: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Espagne
    FI: { length: 18, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Finlande
    FR: { length: 27, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // France
    GB: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Royaume-Uni
    GR: { length: 27, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Grèce
    HR: { length: 21, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Croatie
    HU: { length: 28, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Hongrie
    IE: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Irlande
    IT: { length: 27, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Italie
    LT: { length: 20, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Lituanie
    LU: { length: 20, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Luxembourg
    LV: { length: 21, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Lettonie
    MT: { length: 31, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Malte
    NL: { length: 20, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Pays-Bas
    NO: { length: 15, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Norvège
    PL: { length: 28, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Pologne
    PT: { length: 25, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Portugal
    RO: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Roumanie
    SE: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Suède
    SI: { length: 19, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Slovénie
    SK: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Slovaquie
    IS: { length: 26, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Islande
    AL: { length: 28, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Albanie
    MD: { length: 24, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Moldavie
    ME: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Monténégro
    MK: { length: 19, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Macédoine
    RS: { length: 22, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Serbie
    TR: { length: 26, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Turquie
    UA: { length: 29, regex: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/ }, // Ukraine
};

export enum PriceUnit {
    EUR = '€',
    USD = '$',
    GBP = '£',
    JPY = '¥',
    CNY = '¥',
    RUB = '₽',
    KRW = '₩',
    THB = '฿',
}