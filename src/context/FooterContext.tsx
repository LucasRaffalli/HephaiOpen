import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FooterContextType {
  isFooterEnabled: boolean;
  setIsFooterEnabled: (value: boolean) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFooterEnabled, setIsFooterEnabled] = useState(true);

  return (
    <FooterContext.Provider value={{ isFooterEnabled, setIsFooterEnabled }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};