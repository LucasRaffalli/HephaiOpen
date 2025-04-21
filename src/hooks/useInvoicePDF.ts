import { useState } from "react";
import { jsPDF } from "jspdf";
import { OptionPdf, PdfMetadata } from "@/types/hephai";
import { addLogoToPDF, setupPDFAuthor, setupPDFClient, setupPDFComments, setupPDFFooter, setupPDFHeader, setupPDFModality, setupPDFPrice, setupPDFTable } from "@/utils/pdfUtils";
import { getNextInvoiceNumber } from "@/utils/InvoiceCounter";

export const useInvoicePDF = (options: OptionPdf) => {
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(true);
    const [customMetadata, setCustomMetadata] = useState<PdfMetadata>({
        Title: '',
        Author: '',
        Subject: '',
        Keywords: '',
        Producer: 'HephaiOpen PDF Generator',
        PDFFormatVersion: '1.7',
        PageSize: 'A4',
        Application: 'HephaiOpen',
        Modified: new Date().toLocaleString(),
        Created: new Date().toLocaleString()
    });

    const calculateInvoiceTotals = (rows: any[], vatRate: number, amountPaid: number) => {
        const subtotalHT = rows.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);
        const vatAmount = (subtotalHT * vatRate) / 100;
        const totalTTC = subtotalHT + vatAmount;
        const balanceDue = totalTTC - (amountPaid || 0);

        return {
            subtotalHT: subtotalHT.toFixed(2),
            vatRate,
            vatAmount: vatAmount.toFixed(2),
            totalTTC: totalTTC.toFixed(2),
            balanceDue: balanceDue.toFixed(2),
        };
    };

    const generatePDF = async (isPreview: boolean = true): Promise<Uint8Array> => {
        const { clientInfo, companyInfo, paymentInfo, rows, selectedDate, imageSrc, columns, priceUnit, modalitiesText1, modalitiesText2, commentsText, isCommentsEnabled, isModalitiesEnabled, isFooterEnabled } = options;
        const invoiceNumber = getNextInvoiceNumber();
        const storedTva = localStorage.getItem('tva');
        const vatRate = storedTva ? parseFloat(storedTva) : 0;

        const doc = new jsPDF("portrait", "mm", "a4");

        doc.setProperties({
            creator: customMetadata.Application || 'HephaiOpen',
            title: customMetadata.Title || `Invoice ${invoiceNumber}`,
            author: customMetadata.Author || companyInfo.authorCompanyName,
            subject: customMetadata.Subject || `-`,
            keywords: customMetadata.Keywords || `Invoice, HephaiOpen` + `, ${invoiceNumber}, ${clientInfo.companyName}`,
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const paymentText = paymentInfo.type === "Iban" ? "Virement bancaire" : paymentInfo.type;

        setupPDFHeader(doc, pageWidth, paymentText, selectedDate, paymentInfo, invoiceNumber);

        await addLogoToPDF(doc, imageSrc, pageHeight);

        setupPDFClient(doc, clientInfo, isPreview);

        setupPDFAuthor(doc, pageWidth, companyInfo, isPreview);

        const rowsWithFallback = rows.length > 0 ? rows : [{ product: "—", quantity: "—", total: "0.00" }];

        setupPDFTable(doc, rowsWithFallback, { columns, priceUnit });

        const invoiceTotals = calculateInvoiceTotals(rowsWithFallback, vatRate, Number(paymentInfo.amountPaid) || 0);

        const tableFinalY = (doc as any).lastAutoTable.finalY || 110;
        let startY = tableFinalY + 20;
        const marginBottom = 20;

        const priceHeight = 4 * 8 + 10;
        const modalityHeight = isModalitiesEnabled ? ((doc.splitTextToSize(modalitiesText1 || "", pageWidth - 110).length + doc.splitTextToSize(modalitiesText2 || "", pageWidth - 110).length) * 5 + 10) : 0;

        const maxHeight = Math.max(priceHeight, modalityHeight);

        if (startY + maxHeight > pageHeight - marginBottom) {
            doc.addPage();
            startY = 10;
        }

        const priceY = startY;
        const { endY: priceEndY, priceWidth } = setupPDFPrice(doc, { ...invoiceTotals, priceUnit }, priceY);

        const modalityStartY = priceY;
        const { endY: modalityEndY, remainingPageSpace, position } = setupPDFModality(
            doc,
            options,
            modalitiesText1,
            modalitiesText2,
            isModalitiesEnabled,
            modalityStartY,
            priceWidth + 10
        );

        const commentsStartY = position === 'beside' ? Math.max(priceEndY, modalityEndY) : modalityEndY;
        setupPDFComments(doc, options, commentsText, commentsStartY, isCommentsEnabled, remainingPageSpace);

        setupPDFFooter(doc, isFooterEnabled, 0);

        const pdfBytes = doc.output("arraybuffer");
        return new Uint8Array(pdfBytes);
    };

    const generatePreview = async () => {
        try {
            const pdfBytes = await generatePDF(true);
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            setPdfPreviewUrl(URL.createObjectURL(pdfBlob));
        } catch (error) {
            console.error("Erreur lors de la génération de l'aperçu PDF:", error);
        }
    };

    const showFinalVersion = async () => {
        try {
            setIsLoading(true);
            const pdfBytes = await generatePDF(false);
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(pdfBlob);
            setPdfPreviewUrl(url);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de l'affichage de la version finale:", error);
            setIsLoading(false);
        }
    };

    const updateInvoiceCounter = () => {
        const currentYear = new Date().getFullYear();
        const storedInvoiceNumber = localStorage.getItem("invoiceCounter");

        let nextNumber = 1;
        if (storedInvoiceNumber) {
            const [storedYear, storedCount] = storedInvoiceNumber.split("-");
            if (parseInt(storedYear) === currentYear) {
                nextNumber = parseInt(storedCount) + 1;
            }
        }

        localStorage.setItem("invoiceCounter", `${currentYear}-${String(nextNumber).padStart(4, "0")}`);
    };

    const downloadPDF = async () => {
        try {
            setIsLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const pdfBytes = await generatePDF(false);
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const invoiceNumber = getNextInvoiceNumber();
            const savedPrefix = localStorage.getItem('customFileNamePrefix');
            const prefix = savedPrefix || options.customFileNamePrefix || "Invoice";
            await new Promise(resolve => setTimeout(resolve, 1500));

            const link = document.createElement("a");
            link.href = url;
            link.download = `${prefix}_${invoiceNumber}.pdf`;
            document.body.appendChild(link);

            await new Promise(resolve => setTimeout(resolve, 500));
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                URL.revokeObjectURL(url);
                setIsLoading(false);
            }, 1000);

            updateInvoiceCounter();
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF:", error);
            setIsLoading(false);
        }
    };

    const printPDF = async () => {
        try {
            setIsLoading(true);
            const pdfBytes = await generatePDF();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'fixed';
            printFrame.style.right = '0';
            printFrame.style.bottom = '0';
            printFrame.style.width = '0';
            printFrame.style.height = '0';
            printFrame.style.border = 'none';

            printFrame.onload = () => {
                try {
                    setTimeout(() => {
                        if (printFrame.contentWindow) {
                            printFrame.contentWindow.print();
                        }
                        setTimeout(() => {
                            document.body.removeChild(printFrame);
                            URL.revokeObjectURL(url);
                            setIsLoading(false);
                        }, 1000);
                    }, 500);
                } catch (error) {
                    console.error("Erreur pendant l'impression:", error);
                    setIsLoading(false);
                }
            };

            printFrame.src = url;
            document.body.appendChild(printFrame);

        } catch (error) {
            console.error("Erreur lors de la préparation de l'impression:", error);
            setIsLoading(false);
        }
    };


    const updateMetadata = (newMetadata: PdfMetadata) => {
        setCustomMetadata(newMetadata);
    };

    const togglePreviewMode = async () => {
        try {
            setIsLoading(true);
            const pdfBytes = await generatePDF(!isPreviewMode);
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(pdfBlob);
            setPdfPreviewUrl(url);
            setIsPreviewMode(!isPreviewMode);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors du changement de mode:", error);
            setIsLoading(false);
        }
    };

    return {
        pdfPreviewUrl,
        downloadPDF,
        printPDF,
        isLoading,
        generatePDF,
        generatePreview,
        showFinalVersion,
        updateMetadata,
        customMetadata,
        togglePreviewMode,
        isPreviewMode,
    };
};