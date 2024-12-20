import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

import { Client, CompanyInfo } from "@/type/hephai";
import { addLogoToPDF, setupPDFAuthor, setupPDFClient, setupPDFHeader, setupPDFTable } from "@/utils/pdfUtils";
import autoTable from "jspdf-autotable";

export const useInvoicePDF = (options: { clientInfo: Client, companyInfo: CompanyInfo, paymentInfo: { type: string; details: string }, rows: any[], columns: any[], selectedDate: string, imageSrc: string | null, priceUnit: string }) => {
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async (): Promise<Uint8Array> => {
        const { clientInfo, companyInfo, paymentInfo, rows, selectedDate, imageSrc, columns, priceUnit } = options;
        const doc = new jsPDF("portrait", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
        const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
        const paymentText = paymentInfo.type === "Iban" ? "Virement bancaire" : paymentInfo.type;

        setupPDFHeader(doc, pageWidth, paymentText, selectedDate, paymentInfo);
        await addLogoToPDF(doc, imageSrc, pageHeight);
        setupPDFClient(doc, clientInfo);
        setupPDFAuthor(doc, pageWidth, companyInfo);
        setupPDFTable(doc, rows, { columns, priceUnit });

        const pdfBytes = doc.output("arraybuffer");
        return new Uint8Array(pdfBytes);

    }


    const generatePreview = async () => {
        try {
            const pdfBytes = await generatePDF();
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            setPdfPreviewUrl(URL.createObjectURL(pdfBlob));
        } catch (error) {
            console.error("Erreur lors de la génération de l'aperçu PDF:", error);
        }
    };

    const downloadPDF = async () => {
        try {
            setIsLoading(true);
            const pdfBytes = await generatePDF();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `facture_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { pdfPreviewUrl, downloadPDF, isLoading, generatePDF, generatePreview };
};
