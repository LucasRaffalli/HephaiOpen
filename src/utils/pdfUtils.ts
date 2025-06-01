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


        return;
    }
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    const scaleFactor = Math.max(img.width, img.height) >= 512 ? 7 : 4;
    const imgWidth = pageHeight / scaleFactor;
    const imgHeight = (img.height / img.width) * imgWidth;
    doc.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
    doc.setFillColor("F2F2F2");
};

const getTranslatedPaymentType = (type: string) => {
    const key = type.toLowerCase();
    return t(`features.invoice.paymentMethods.${key}`);
};

export const setupPDFHeader = (doc: jsPDF, pageWidth: number, paymentText: string, selectedDate: string, paymentInfo: PaymentInfo, invoiceNumber: string,) => {
    doc.setFillColor("F2F2F2");
    doc.rect(0, 0, pageWidth, 60, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(t('features.invoice.title'), pageWidth - 10, 20, { align: "right" });

    doc.setTextColor("#4D4D4D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`${t('features.invoice.number')}: ${invoiceNumber}`, pageWidth - 10, 30, { align: "right" });
    doc.text(`${t('features.invoice.dated')}: ${selectedDate}`, pageWidth - 10, 35, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`${t('features.invoice.paymentMode')}: ${getTranslatedPaymentType(paymentInfo.type)}`, pageWidth - 10, 40, { align: "right" });

    const normalizedType = paymentInfo.type.trim().toUpperCase();

    doc.setFont("helvetica", "normal");
    if (!["cheque", "cash"].includes(normalizedType)) {
        doc.text(`${paymentInfo.details || t('features.invoice.notProvided')}`, pageWidth - 10, 45, { align: "right" });
    }
};

export const setupPDFClient = (doc: jsPDF, clientInfo: any, shouldMask = false) => {
    doc.setTextColor("#4D4D4D");
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
    doc.text(`${displayInfo.companyName}\n${displayInfo.address}\n${displayInfo.phone}\n${displayInfo.email}`, 10, 82);
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
        `${displayInfo.authorCompanyName}\n${displayInfo.authorAddress}\n${displayInfo.authorPhone}\n${displayInfo.authorEmail}${displayInfo.siret ? `\nSIRET : ${displayInfo.siret}` : ''}`,
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
    const fixedGap = 4;
    const lineHeight = 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const amounts = [
        formatPrice(options.subtotalHT, options.priceUnit),
        `${options.vatRate}%`,
        formatPrice(options.vatAmount, options.priceUnit),
        formatPrice(options.balanceDue, options.priceUnit)
    ];
    const maxAmountWidth = Math.max(...amounts.map(amount => doc.getTextWidth(amount)));

    doc.setFont("helvetica", "bold");
    const labels = [
        `${t('features.invoice.subtotalHT')}:`,
        `${t('features.invoice.vat')} (${options.vatRate}%):`,
        `${t('features.invoice.vatAmount')}:`,
        `${t('features.invoice.balanceDue')}:`
    ];
    const maxLabelWidth = Math.max(...labels.map(label => doc.getTextWidth(label)));

    const priceWidth = maxAmountWidth + maxLabelWidth + fixedGap;
    const labelStartX = pageWidth - (priceWidth + 10);
    const amountStartX = pageWidth - 10;

    labels.forEach((label, index) => {
        const y = startY + (index * lineHeight);

        doc.setFont("helvetica", "bold");
        doc.text(label, labelStartX, y);

        doc.setFont("helvetica", "normal");
        doc.text(amounts[index], amountStartX, y, { align: "right" });
    });

    return {
        endY: startY + 4 * lineHeight + 10,
        priceWidth: priceWidth + 20
    };
};

export const setupPDFModality = (doc: jsPDF, options: any, text1: string, text2: string, isEnabled: boolean, startY: number, priceWidth: number = 100) => {
    if (!isEnabled) return { endY: startY - 2, position: 'none' };

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginX = 10;
    const marginRight = 10;
    const marginBottom = 20;
    const minModalityWidth = 300;
    const lineHeight = 4;
    const boxPadding = 5;
    const sectionSpacing = 8;

    const availableWidthBeside = pageWidth - priceWidth;
    const shouldBeBeside = availableWidthBeside >= minModalityWidth;

    let boxWidth;

    if (shouldBeBeside) {
        boxWidth = pageWidth - (marginX * 2);
    } else {
        boxWidth = pageWidth - priceWidth;
    }
    let currentY = startY;
    let lastEndY = currentY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t('features.invoice.modalitiesAndConditions'), marginX, currentY);
    currentY += 4;

    const fullText = text1 + (text1 && text2 ? '\n\n' : '') + text2;
    const modalityLines = doc.splitTextToSize(fullText, boxWidth - (boxPadding - 20));
    let currentLine = 0;

    while (currentLine < modalityLines.length) {
        const availableHeight = pageHeight - marginBottom - currentY;
        const remainingLines = Math.floor((availableHeight - (boxPadding * 2)) / lineHeight);
        const linesToDraw = Math.min(remainingLines, modalityLines.length - currentLine);
        const boxHeight = (linesToDraw * lineHeight) + (boxPadding * 2);

        doc.setFont("helvetica", "normal");
        doc.rect(marginX, currentY, boxWidth, boxHeight);

        doc.setFontSize(10);
        const partialModality = modalityLines.slice(currentLine, currentLine + linesToDraw).join('\n');
        doc.text(partialModality, marginX + boxPadding, currentY + boxPadding + 2);

        currentLine += linesToDraw;
        lastEndY = currentY + boxHeight + sectionSpacing;

        if (currentLine < modalityLines.length) {
            doc.addPage();
            currentY = 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(`${t('features.invoice.modalitiesAndConditions')} (${t('features.invoice.continued')})`, marginX, currentY - 2);
            currentY += 4;
        }
    }

    return {
        endY: lastEndY,
        remainingPageSpace: pageHeight - lastEndY - marginBottom,
        position: shouldBeBeside ? 'beside' : 'below'
    };
};

export const setupPDFComments = (doc: jsPDF, options: any, comText: string, startY: number, isEnabled: boolean, remainingPageSpace: number = 0) => {
    if (!isEnabled) return startY;

    const pageWidth = doc.internal.pageSize.width;
    const marginX = 10;
    const boxWidth = pageWidth - (marginX * 2);
    const lineHeight = 4;
    const boxPadding = 5;
    const titleHeight = 4;

    const commentLines = doc.splitTextToSize(comText, boxWidth - (boxPadding * 2));
    const totalCommentsHeight = (commentLines.length * lineHeight) + (boxPadding * 2) + titleHeight;

    let currentY = startY - 2;

    if (remainingPageSpace < totalCommentsHeight) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t('features.invoice.additionalComments'), marginX, currentY);
    currentY += 4;

    doc.setFont("helvetica", "normal");
    const boxHeight = (commentLines.length * lineHeight) + (boxPadding * 2);
    doc.rect(marginX, currentY, boxWidth, boxHeight);

    doc.setFontSize(10);
    doc.text(commentLines, marginX + boxPadding, currentY + boxPadding + 2);

    return currentY + boxHeight;
};

export const setupPDFFooter = (doc: jsPDF, isEnabled: boolean, startY: number) => {
    if (!isEnabled) return startY;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const footerY = pageHeight - 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#808080");
    doc.text(`${t('utils.credit')}`, pageWidth / 2, footerY, { align: "center" });
};
