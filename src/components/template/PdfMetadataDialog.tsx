import React, { useState, useEffect } from 'react';
import { Dialog, Box, Text, Button, Flex, Tooltip } from '@radix-ui/themes';
import { FileText } from 'lucide-react';
import { PdfMetadata, PDFInfo } from '@/types/hephai';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { t } from 'i18next';

const formatPDFDate = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, '0');

    const d = new Date(date);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    const tzOffset = d.getTimezoneOffset();
    const tzHours = pad(Math.abs(Math.floor(tzOffset / 60)));
    const tzMinutes = pad(Math.abs(tzOffset % 60));

    return `D:${year}${month}${day}${hours}${minutes}${seconds}${tzOffset <= 0 ? '+' : '-'}${tzHours}'${tzMinutes}'`;
};

const parsePDFDate = (pdfDate: string) => {
    if (!pdfDate?.startsWith('D:')) return pdfDate;

    const match = pdfDate.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})([-+]\d{2})'(\d{2})'?/);
    if (!match) return pdfDate;

    const [_, year, month, day, hour, minute, second, tzHour, tzMinute] = match;
    const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    );

    const tzOffset = parseInt(tzHour + tzMinute);
    date.setMinutes(date.getMinutes() + tzOffset);

    return date.toLocaleString();
};

const ptsToMm = (pts: number) => (pts * 0.352778).toFixed(2);

const getPDFPageSize = async (pdfDoc: PDFDocumentProxy) => {
    try {
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        return `${ptsToMm(viewport.width)}mm × ${ptsToMm(viewport.height)}mm`;
    } catch (error) {
        console.error("Erreur lors de la récupération de la taille:", error);
        return `${t('text.error')}`;
    }
};

interface PdfMetadataDialogProps {
    pdfDoc?: PDFDocumentProxy;
    onMetadataChange?: (metadata: PdfMetadata) => void;
}

const PdfMetadataDialog: React.FC<PdfMetadataDialogProps> = ({ pdfDoc, onMetadataChange }) => {
    const [metadata, setMetadata] = useState<PdfMetadata>({
        Title: '',
        Author: '',
        Subject: '',
        Keywords: '',
        Producer: '',
        PDFFormatVersion: '',
        PageSize: '',
        Application: 'HephaiOpen',
        Modified: formatPDFDate(new Date()),
        Created: formatPDFDate(new Date())
    });

    useEffect(() => {
        const loadMetadata = async () => {
            if (!pdfDoc) return;

            try {
                const metadataInfo = await pdfDoc.getMetadata();
                const pageSize = await getPDFPageSize(pdfDoc);
                const info = metadataInfo?.info as PDFInfo || {};

                setMetadata({
                    Title: info.Title ?? 'Sans titre',
                    Author: info.Author ?? 'Auteur inconnu',
                    Subject: info.Subject ?? 'Aucun sujet',
                    Keywords: info.Keywords ?? '',
                    Producer: info.Producer ?? 'HephaiOpen PDF Generator',
                    PageSize: pageSize,
                    Application: 'HephaiOpen',
                    Modified: info.ModDate ?? formatPDFDate(new Date()),
                    Created: info.CreationDate ?? formatPDFDate(new Date())
                });
            } catch (error) {
                console.error("Erreur lors du chargement des métadonnées:", error);
            }
        };

        loadMetadata();
    }, [pdfDoc]);

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Tooltip content={t('utils.tooltips.metadata')} side="bottom">
                    <Button variant="soft" className='btnCursor' >
                        <FileText size={18} />
                        <Text>{t('buttons.metadata')}</Text>
                    </Button>
                </Tooltip>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>{t('metadata.title')}</Dialog.Title>

                <Box p="3">
                    <Text as="div" weight="bold" mb="2" size={"5"}>{t('metadata.title2')} :</Text>
                    {['Title', 'Author', 'Subject', 'Keywords'].map((key) => (
                        <Text as="div" size="2" mb="2" key={key}>
                            <strong>{key}:</strong>{" "}
                            <Text color={"gray"}>
                                <span>{metadata[key as keyof PdfMetadata] || '—'}</span>

                            </Text>
                        </Text>
                    ))}

                    <Text as="div" weight="bold" mt="4" mb="2" size={"5"}>{t('metadata.title3')} :</Text>
                    {['Producer', 'PDFFormatVersion', 'PageSize', 'Application', 'Created', 'Modified'].map((key) => (
                        <Text as="div" size="2" mb="2" key={key}>
                            <strong>{key}:</strong>{" "}
                            <Text color={"gray"}>
                                {key === 'Created' || key === 'Modified'
                                    ? parsePDFDate(metadata[key as keyof PdfMetadata] || '')
                                    : metadata[key as keyof PdfMetadata] || '—'}
                            </Text>
                        </Text>
                    ))}

                    <Dialog.Close>
                        <Flex width={"100%"} justify={"end"}>

                            <Button variant="soft" color="red" className='btnCursor' style={{ marginTop: '1rem' }}>
                                {t('buttons.close')}
                            </Button>
                        </Flex>
                    </Dialog.Close>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default PdfMetadataDialog;
