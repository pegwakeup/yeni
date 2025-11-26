import React, { createContext, useContext, useState } from 'react';
import { PrivacyPolicyModal } from './privacy-policy-modal';
import { TermsModal } from './terms-modal';

interface PrivacyTermsContextType {
  openPrivacyPolicy: () => void;
  openTerms: () => void;
}

const PrivacyTermsContext = createContext<PrivacyTermsContextType | undefined>(undefined);

export const usePrivacyTerms = () => {
  const context = useContext(PrivacyTermsContext);
  if (!context) {
    throw new Error('usePrivacyTerms must be used within a PrivacyTermsProvider');
  }
  return context;
};

export const PrivacyTermsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openPrivacyPolicy = () => setIsPrivacyOpen(true);
  const openTerms = () => setIsTermsOpen(true);

  return (
    <PrivacyTermsContext.Provider value={{ openPrivacyPolicy, openTerms }}>
      {children}
      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
    </PrivacyTermsContext.Provider>
  );
};