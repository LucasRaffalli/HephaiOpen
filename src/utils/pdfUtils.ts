
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

export const setupPDFSections = (doc: jsPDF, options: any, text1: string, text2: string, comText: string, isModalityEnabled: boolean, isCommentsEnabled: boolean) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const tableFinalY = (doc as any).lastAutoTable.finalY || 110;
    let startY = tableFinalY + 20;
    const marginBottom = 20;

    const priceHeight = 4 * 8 + 10; 
    const modalityHeight = isModalityEnabled ? ((doc.splitTextToSize(text1 || "", pageWidth - 110).length + doc.splitTextToSize(text2 || "", pageWidth - 110).length) * 5 + 10) : 0;
    const commentsHeight = isCommentsEnabled ? (doc.splitTextToSize(comText || "", pageWidth - 20).length * 4 + 10) : 0;

    const totalHeight = priceHeight + modalityHeight + commentsHeight + 10;

    if (startY + totalHeight > pageHeight - marginBottom) {
        doc.addPage();
        startY = 10;
    }

    startY = setupPDFPrice(doc, options, startY);

    if (isModalityEnabled) {
        startY = setupPDFModality(doc, options, text1, text2, true, startY);
    }

    if (isCommentsEnabled) {
        setupPDFComments(doc, options, comText, startY, true);
    }
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
    if (!isEnabled) return startY;

    const pageWidth = doc.internal.pageSize.width;
    const startX = 10;
    const lineHeight = 5;
    const boxPadding = 4;
    const boxWidth = pageWidth - 100;

    const textLines1 = doc.splitTextToSize(text1 || "", boxWidth - 2 * boxPadding);
    const textLines2 = doc.splitTextToSize(text2 || "", boxWidth - 2 * boxPadding);
    const boxHeight = (textLines1.length + textLines2.length) * lineHeight + boxPadding + 3.2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${t('features.invoice.modalitiesAndConditions')}:`, startX, startY);

    doc.rect(startX, startY + lineHeight, boxWidth, boxHeight);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(textLines1, startX + boxPadding, startY + lineHeight * 3);
    const text2StartY = startY + lineHeight * 3 + textLines1.length * lineHeight;
    doc.text(textLines2, startX + boxPadding, text2StartY);

    return startY + boxHeight + 10;
};

export const setupPDFComments = (doc: jsPDF, options: any, comText: string, startY: number, isEnabled: boolean) => {
    if (!isEnabled) return;

    const pageWidth = doc.internal.pageSize.width;
    const startX = 10;
    const lineHeight = 2.2;
    const boxPadding = 4;
    const boxWidth = pageWidth - 20;

    const text = comText || "";
    const textLines = doc.splitTextToSize(text, boxWidth - 2 * boxPadding);
    const boxHeight = textLines.length * 4 + boxPadding + 3.2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${t('features.invoice.additionalComments')}:`, startX, startY);

    doc.rect(startX, startY + lineHeight, boxWidth, boxHeight);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(textLines, startX + boxPadding, startY + lineHeight * 4);
};
