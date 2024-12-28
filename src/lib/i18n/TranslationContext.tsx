import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface TranslationContextType {
  t: (key: string, namespace?: string) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  loading: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  currentLanguage: 'en',
  setLanguage: () => {},
  loading: true,
});

export function TranslationProvider({
  organizationId,
  defaultLanguage = 'en',
  children,
}: {
  organizationId: string;
  defaultLanguage?: string;
  children: React.ReactNode;
}) {
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations(lang: string) {
      try {
        const { data } = await supabase
          .from('translations')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('language', lang);

        if (data) {
          const formattedTranslations = data.reduce((acc, item) => {
            if (!acc[item.namespace]) {
              acc[item.namespace] = {};
            }
            acc[item.namespace][item.key] = item.value;
            return acc;
          }, {} as Record<string, Record<string, string>>);

          setTranslations(formattedTranslations);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTranslations(currentLanguage);
  }, [organizationId, currentLanguage]);

  function t(key: string, namespace: string = 'common'): string {
    if (loading) return key;
    return translations[namespace]?.[key] || key;
  }

  return (
    <TranslationContext.Provider
      value={{
        t,
        currentLanguage,
        setLanguage: setCurrentLanguage,
        loading,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => useContext(TranslationContext);