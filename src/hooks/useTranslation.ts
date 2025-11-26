import { useLanguage } from '../contexts/LanguageContext';

export function useTranslation() {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  return {
    language,
    setLanguage,
    toggleLanguage,
    t
  };
}
