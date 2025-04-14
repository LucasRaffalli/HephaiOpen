import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as pdfjsLib from "pdfjs-dist";

interface PDFContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  setPdfDoc: (doc: pdfjsLib.PDFDocumentProxy | null) => void;
  refreshPDF: () => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPDF = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <PDFContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      pdfDoc, 
      setPdfDoc,
      refreshPDF 
    }}>
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};