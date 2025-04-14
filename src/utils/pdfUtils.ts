import { PaymentInfo } from "@/types/hephai";
import { t } from "i18next";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
const maskSensitiveInfo = (text: string): string => {
    if (!text) return '';
    const maskedLength = Math.max(text.length, 8);
    return '•'.repeat(maskedLength);
};
export const addLogoToPDF = async (doc: jsPDF, imageSrc: string | null, pageHeight: number) => {
    if (!imageSrc) {
        doc.setFillColor("150");
        doc.rect(10, 10, 40, 40, "F");
        return;
    }
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    const scaleFactor = Math.max(img.width, img.height) >= 512 ? 7 : 4;
    const imgWidth = pageHeight / scaleFactor;
    const imgHeight = (img.height / img.width) * imgWidth;
    doc.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
};

export const setupPDFHeader = (
    doc: jsPDF,
    pageWidth: number,
    paymentText: string,
    selectedDate: string,
    paymentInfo: PaymentInfo,
    invoiceNumber: string,
) => {
    doc.setFillColor("F2F2F2");
    doc.rect(0, 0, pageWidth, 60, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(t('features.invoice.title'), pageWidth - 10, 20, { align: "right" });

    doc.setTextColor("#4D4D4D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`${t('features.invoice.number')}: ${invoiceNumber} `, pageWidth - 10, 30, { align: "right" });
    doc.text(`${t('features.invoice.dated')}: ${selectedDate}`, pageWidth - 10, 35, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`${t('features.invoice.paymentMode')}: ${paymentText}`, pageWidth - 10, 40, { align: "right" });

    const normalizedType = paymentInfo.type.trim().toUpperCase();

    doc.setFont("helvetica", "normal");
    if (!["cheque", "cash"].includes(normalizedType)) {
        doc.text(`${paymentInfo.details || t('features.invoice.notProvided')}`, pageWidth - 10, 45, { align: "right" });
    }
};

export const setupPDFClient = (doc: jsPDF, clientInfo: any, shouldMask = false) => {
    doc.setTextColor("");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${t('features.invoice.billedTo')}:`, 10, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#4D4D4D");

    const displayInfo = {
        companyName: clientInfo.companyName,
        address: shouldMask ? maskSensitiveInfo(clientInfo.address) : clientInfo.address,
        phone: shouldMask ? maskSensitiveInfo(clientInfo.phone) : clientInfo.phone,
        email: shouldMask ? maskSensitiveInfo(clientInfo.email) : clientInfo.email,
    }
    doc.text(
        `${displayInfo.companyName}\n${displayInfo.address}\n${displayInfo.phone}\n${displayInfo.email}`,
        10,
        82
    );
    doc.setTextColor("");
}



export const setupPDFAuthor = (doc: jsPDF, pageWidth: any, companyInfo: any, shouldMask = false) => {
    doc.setTextColor("");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${t('features.invoice.invoicedBy')}:`, pageWidth - 10, 75, { align: "right" });
    doc.setTextColor("#4D4D4D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);

    const displayInfo = {
        authorCompanyName: shouldMask ? maskSensitiveInfo(companyInfo.authorCompanyName) : companyInfo.authorCompanyName,
        authorAddress: shouldMask ? maskSensitiveInfo(companyInfo.authorAddress) : companyInfo.authorAddress,
        authorPhone: shouldMask ? maskSensitiveInfo(companyInfo.authorPhone) : companyInfo.authorPhone,
        authorEmail: shouldMask ? maskSensitiveInfo(companyInfo.authorEmail) : companyInfo.authorEmail,
        siret: shouldMask ? maskSensitiveInfo(companyInfo.siret) : companyInfo.siret
    };

    doc.text(
        `${displayInfo.authorCompanyName}\n${displayInfo.authorAddress}\n${displayInfo.authorPhone}\n${displayInfo.authorEmail}\n${t('features.invoice.siret')}: ${displayInfo.siret}`,
        pageWidth - 10,
        82,
        { align: "right" }
    );
    doc.setTextColor("");
}

export const setupPDFTable = (doc: jsPDF, rows: any[], options: any) => {
    const tableStartX = 10;
    const fixedColumns = [{ header: t('features.invoice.tableItem.product'), dataKey: 'product' }, { header: `${t('features.invoice.tableItem.total')} (${options.priceUnit})`, dataKey: 'total' }];
    const columnsLocal = [fixedColumns[0], ...options.columns, fixedColumns[1]];

    autoTable(doc, {
        head: [columnsLocal.map((col: { header: any; }) => col.header)],
        body: rows.map((row: { [x: string]: any; }) => columnsLocal.map((col: { dataKey: string | number; }) => col.dataKey === 'total' ? `${row[col.dataKey] || ''} ${options.priceUnit}` : row[col.dataKey] || '')),
        margin: { left: tableStartX, right: 10 },
        startY: 110,
        theme: 'grid',
        styles: { lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center', },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', },
        alternateRowStyles: { lineWidth: 0.5, fillColor: [255, 255, 255], },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
        pageBreak: 'auto',

    });

};


const formatPrice = (value: number | string, currency: string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
        return `0,00 ${currency}`;
    }

    const parts = numericValue.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',') + ` ${currency}`;
};

export const setupPDFPrice = (doc: jsPDF, options: any, startY: number) => {
    const pageWidth = doc.internal.pageSize.width;
    const startX = pageWidth - 80;
    const lineHeight = 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text(`${t('features.invoice.subtotalHT')}:`, startX, startY);
    doc.text(`${t('features.invoice.vat')} (${options.vatRate}%)`, startX, startY + lineHeight);
    doc.text(`${t('features.invoice.vatAmount')}:`, startX, startY + 2 * lineHeight);
    doc.text(`${t('features.invoice.balanceDue')}:`, startX, startY + 3 * lineHeight);

    doc.setFont("helvetica", "normal");

    doc.text(formatPrice(options.subtotalHT, options.priceUnit), pageWidth - 10, startY, { align: "right" });
    doc.text(`${options.vatRate}%`, pageWidth - 10, startY + lineHeight, { align: "right" });
    doc.text(formatPrice(options.vatAmount, options.priceUnit), pageWidth - 10, startY + 2 * lineHeight, { align: "right" });
    doc.text(formatPrice(options.balanceDue, options.priceUnit), pageWidth - 10, startY + 3 * lineHeight, { align: "right" });

    return startY + 4 * lineHeight + 10;
};

export const setupPDFModality = (doc: jsPDF, options: any, text1: string, text2: string, isEnabled: boolean, startY: number) => {
    if (!isEnabled) return { endY: startY };

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginX = 10;
    const marginBottom = 20;
    const boxWidth = pageWidth - 100;
    const lineHeight = 4;
    const boxPadding = 5;

    let currentY = startY;

    // Combine les deux textes avec un séparateur
    const fullText = text1 + (text1 && text2 ? '\n\n' : '') + text2;
    const modalityLines = doc.splitTextToSize(fullText, boxWidth - (boxPadding * 2));
    let currentLine = 0;

    // Titre initial
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t('features.invoice.modalitiesAndConditions'), marginX, currentY);
    currentY += 3;

    let finalY = currentY;
    while (currentLine < modalityLines.length) {
        const availableHeight = pageHeight - marginBottom - currentY;
        const remainingLines = Math.floor((availableHeight - (boxPadding * 2)) / lineHeight);
        const linesToDraw = Math.min(remainingLines, modalityLines.length - currentLine);
        const boxHeight = (linesToDraw * lineHeight) + (boxPadding * 2);

        // Dessiner l'encadré
        doc.setFont("helvetica", "normal");
        doc.rect(marginX, currentY, boxWidth, boxHeight);

        // Ajouter le texte avec padding
        doc.setFontSize(10);
        const partialModality = modalityLines.slice(currentLine, currentLine + linesToDraw).join('\n');
        doc.text(partialModality, marginX + boxPadding, currentY + boxPadding + 2);

        currentLine += linesToDraw;

        if (currentLine < modalityLines.length) {
            doc.addPage();
            currentY = 20;
            // Ajouter le titre avec "(suite)" sur la nouvelle page
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(`${t('features.invoice.modalitiesAndConditions')} (${t('features.invoice.continued')})`, marginX, currentY - 2);
            currentY += 3;
        } else {
            finalY = currentY + boxHeight;
        }
    }

    return { endY: finalY };
};

export const setupPDFComments = (doc: jsPDF, options: any, comText: string, startY: number, isEnabled: boolean) => {
    if (!isEnabled) return;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginX = 10;
    const marginBottom = 20;
    const boxWidth = pageWidth - (marginX * 2);
    const lineHeight = 4;
    const boxPadding = 5;

    let currentY = startY;
    const commentLines = doc.splitTextToSize(comText, boxWidth - (boxPadding * 2));
    let currentLine = 0;

    // Titre initial "Commentaires"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t('features.invoice.additionalComments'), marginX, currentY);
    currentY += 3;

    while (currentLine < commentLines.length) {
        const availableHeight = pageHeight - marginBottom - currentY;
        const remainingLines = Math.floor((availableHeight - (boxPadding * 2)) / lineHeight);
        const linesToDraw = Math.min(remainingLines, commentLines.length - currentLine);
        const boxHeight = (linesToDraw * lineHeight) + (boxPadding * 2);

        // Dessiner l'encadré
        doc.setFont("helvetica", "normal");
        doc.rect(marginX, currentY, boxWidth, boxHeight);

        // Ajouter le texte avec padding
        doc.setFontSize(10);
        const partialComments = commentLines.slice(currentLine, currentLine + linesToDraw).join('\n');
        doc.text(partialComments, marginX + boxPadding, currentY + boxPadding + 2);

        currentLine += linesToDraw;

        if (currentLine < commentLines.length) {
            doc.addPage();
            currentY = 20;
            // Ajouter le titre avec "(suite)" sur la nouvelle page
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(`${t('features.invoice.additionalComments')} (${t('features.invoice.continued')})`, marginX, currentY - 2);
            currentY += 3;
        }
    }
};

export const setupPDFFooter = (doc: jsPDF, isEnabled: boolean, startY: number) => {
    if (!isEnabled) return startY;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#808080");
    doc.text(`${t('utils.credit')}`, pageWidth / 2, pageHeight - 10, { align: "center" });
};
