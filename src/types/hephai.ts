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
    AT: { length: 20, regex: /^AT\d{2}[A-Z0-9]{16}$/ }, // Autriche
    BE: { length: 16, regex: /^BE\d{2}[A-Z0-9]{12}$/ }, // Belgique
    BG: { length: 22, regex: /^BG\d{2}[A-Z0-9]{18}$/ }, // Bulgarie
    CY: { length: 28, regex: /^CY\d{2}[A-Z0-9]{24}$/ }, // Chypre
    CZ: { length: 24, regex: /^CZ\d{2}[A-Z0-9]{20}$/ }, // République Tchèque
    DE: { length: 22, regex: /^DE\d{2}[A-Z0-9]{18}$/ }, // Allemagne
    DK: { length: 18, regex: /^DK\d{2}[A-Z0-9]{14}$/ }, // Danemark
    EE: { length: 20, regex: /^EE\d{2}[A-Z0-9]{16}$/ }, // Estonie
    ES: { length: 24, regex: /^ES\d{2}[A-Z0-9]{20}$/ }, // Espagne
    FI: { length: 18, regex: /^FI\d{2}[A-Z0-9]{14}$/ }, // Finlande
    FR: { length: 27, regex: /^FR\d{2}[A-Z0-9]{23}$/ }, // France
    GB: { length: 22, regex: /^GB\d{2}[A-Z0-9]{18}$/ }, // Royaume-Uni
    GR: { length: 27, regex: /^GR\d{2}[A-Z0-9]{23}$/ }, // Grèce
    HR: { length: 21, regex: /^HR\d{2}[A-Z0-9]{17}$/ }, // Croatie
    HU: { length: 28, regex: /^HU\d{2}[A-Z0-9]{24}$/ }, // Hongrie
    IE: { length: 22, regex: /^IE\d{2}[A-Z0-9]{18}$/ }, // Irlande
    IT: { length: 27, regex: /^IT\d{2}[A-Z0-9]{23}$/ }, // Italie
    LT: { length: 20, regex: /^LT\d{2}[A-Z0-9]{16}$/ }, // Lituanie
    LU: { length: 20, regex: /^LU\d{2}[A-Z0-9]{16}$/ }, // Luxembourg
    LV: { length: 21, regex: /^LV\d{2}[A-Z0-9]{17}$/ }, // Lettonie
    MT: { length: 31, regex: /^MT\d{2}[A-Z0-9]{27}$/ }, // Malte
    NL: { length: 18, regex: /^NL\d{2}[A-Z0-9]{14}$/ }, // Pays-Bas
    NO: { length: 15, regex: /^NO\d{2}[A-Z0-9]{11}$/ }, // Norvège
    PL: { length: 28, regex: /^PL\d{2}[A-Z0-9]{24}$/ }, // Pologne
    PT: { length: 25, regex: /^PT\d{2}[A-Z0-9]{21}$/ }, // Portugal
    RO: { length: 24, regex: /^RO\d{2}[A-Z0-9]{20}$/ }, // Roumanie
    SE: { length: 24, regex: /^SE\d{2}[A-Z0-9]{20}$/ }, // Suède
    SI: { length: 19, regex: /^SI\d{2}[A-Z0-9]{15}$/ }, // Slovénie
    SK: { length: 24, regex: /^SK\d{2}[A-Z0-9]{20}$/ }, // Slovaquie
    IS: { length: 26, regex: /^IS\d{2}[A-Z0-9]{22}$/ }, // Islande
    AL: { length: 28, regex: /^AL\d{2}[A-Z0-9]{24}$/ }, // Albanie
    MD: { length: 24, regex: /^MD\d{2}[A-Z0-9]{20}$/ }, // Moldavie
    ME: { length: 22, regex: /^ME\d{2}[A-Z0-9]{18}$/ }, // Monténégro
    MK: { length: 19, regex: /^MK\d{2}[A-Z0-9]{15}$/ }, // Macédoine
    RS: { length: 22, regex: /^RS\d{2}[A-Z0-9]{18}$/ }, // Serbie
    TR: { length: 26, regex: /^TR\d{2}[A-Z0-9]{22}$/ }, // Turquie
    UA: { length: 29, regex: /^UA\d{2}[A-Z0-9]{25}$/ }, // Ukraine
};
export const phoneFormats: { [key: string]: { length: number; regex: RegExp } } = {
    AT: { length: 12, regex: /^\+43\d{9}$/ },     // Autriche
    BE: { length: 11, regex: /^\+32\d{8,9}$/ },   // Belgique
    BG: { length: 12, regex: /^\+359\d{8,9}$/ },  // Bulgarie
    CY: { length: 11, regex: /^\+357\d{8}$/ },    // Chypre
    CZ: { length: 12, regex: /^\+420\d{9}$/ },    // République Tchèque
    DE: { length: 13, regex: /^\+49\d{10,11}$/ }, // Allemagne
    DK: { length: 11, regex: /^\+45\d{8}$/ },     // Danemark
    EE: { length: 11, regex: /^\+372\d{7,8}$/ },  // Estonie
    ES: { length: 12, regex: /^\+34\d{9}$/ },     // Espagne
    FI: { length: 12, regex: /^\+358\d{9}$/ },    // Finlande
    FR: { length: 12, regex: /^\+33\d{9}$/ },     // France
    GB: { length: 13, regex: /^\+44\d{10}$/ },    // Royaume-Uni
    GR: { length: 12, regex: /^\+30\d{10}$/ },    // Grèce
    HR: { length: 12, regex: /^\+385\d{8,9}$/ },  // Croatie
    HU: { length: 11, regex: /^\+36\d{9}$/ },     // Hongrie
    IE: { length: 12, regex: /^\+353\d{9}$/ },    // Irlande
    IT: { length: 12, regex: /^\+39\d{10}$/ },    // Italie
    LT: { length: 11, regex: /^\+370\d{8}$/ },    // Lituanie
    LU: { length: 12, regex: /^\+352\d{8,9}$/ },  // Luxembourg
    LV: { length: 11, regex: /^\+371\d{8}$/ },    // Lettonie
    MT: { length: 11, regex: /^\+356\d{8}$/ },    // Malte
    NL: { length: 12, regex: /^\+31\d{9}$/ },     // Pays-Bas
    NO: { length: 11, regex: /^\+47\d{8}$/ },     // Norvège
    PL: { length: 12, regex: /^\+48\d{9}$/ },     // Pologne
    PT: { length: 12, regex: /^\+351\d{9}$/ },    // Portugal
    RO: { length: 12, regex: /^\+40\d{9}$/ },     // Roumanie
    SE: { length: 12, regex: /^\+46\d{9,10}$/ },  // Suède
    SI: { length: 11, regex: /^\+386\d{8}$/ },    // Slovénie
    SK: { length: 12, regex: /^\+421\d{9}$/ },    // Slovaquie
    IS: { length: 10, regex: /^\+354\d{7}$/ },    // Islande
    AL: { length: 12, regex: /^\+355\d{9}$/ },    // Albanie
    MD: { length: 12, regex: /^\+373\d{8}$/ },    // Moldavie
    ME: { length: 12, regex: /^\+382\d{8}$/ },    // Monténégro
    MK: { length: 11, regex: /^\+389\d{8}$/ },    // Macédoine
    RS: { length: 12, regex: /^\+381\d{8,9}$/ },  // Serbie
    TR: { length: 13, regex: /^\+90\d{10}$/ },    // Turquie
    UA: { length: 13, regex: /^\+380\d{9}$/ },    // Ukraine
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

export interface ToolBar {


}