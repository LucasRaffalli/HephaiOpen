import { t } from "i18next";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

export const setupPDFHeader = (doc: jsPDF, pageWidth: number, paymentText: string, selectedDate: string, paymentInfo: any) => {
    doc.setFillColor("F2F2F2");
    doc.rect(0, 0, pageWidth, 60, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(t('features.invoice.title'), pageWidth - 10, 20, { align: "right" });
    doc.setTextColor("#4D4D4D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${t('features.invoice.number')}: #0000`, pageWidth - 10, 30, { align: "right" });
    doc.text(`${t('features.invoice.paymentMode')}: ${paymentText}`, pageWidth - 10, 40, { align: "right" });
    doc.text(`${t('features.invoice.date')}: ${selectedDate}`, pageWidth - 10, 35, { align: "right" });
    doc.text(`${t('features.invoice.details')}: ${paymentInfo.details || t('features.invoice.notProvided')}`, pageWidth - 10, 45, { align: "right" });
};


export const setupPDFClient = (doc: jsPDF, clientInfo: any) => {
    doc.setTextColor("");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${t('features.invoice.billedTo')}:`, 10, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#4D4D4D");
    doc.text(`${clientInfo.companyName}\n${clientInfo.address}\n${clientInfo.phone}\n${clientInfo.email}`, 10, 82);
    doc.setTextColor("");

}
export const setupPDFAuthor = (doc: jsPDF, pageWidth: any, companyInfo: any) => {
    doc.setTextColor("");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${t('features.invoice.invoicedBy')}:`, pageWidth - 10, 75, { align: "right" });
    doc.setTextColor("#4D4D4D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(`${companyInfo.authorCompanyName}\n${companyInfo.authorAddress}\n${companyInfo.authorPhone}\n${companyInfo.authorEmail}\n${t('features.invoice.siret')}: ${companyInfo.siret}`, pageWidth - 10, 82, { align: "right" });
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
    });
};


export const PDFDetails = () => {


}