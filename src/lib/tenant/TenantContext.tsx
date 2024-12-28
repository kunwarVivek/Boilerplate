import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
}

interface TenantSettings {
  defaultLanguage: string;
  availableLanguages: string[];
  customDomain?: string;
  features: Record<string, boolean>;
}

interface TenantContextType {
  theme: TenantTheme;
  settings: TenantSettings;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  theme: {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
  },
  settings: {
    defaultLanguage: 'en',
    availableLanguages: ['en'],
    features: {},
  },
  loading: true,
});

export function TenantProvider({ 
  organizationId,
  children 
}: { 
  organizationId: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<TenantTheme>({
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
  });
  const [settings, setSettings] = useState<TenantSettings>({
    defaultLanguage: 'en',
    availableLanguages: ['en'],
    features: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenantConfig() {
      try {
        // Load theme
        const { data: themeData } = await supabase
          .from('tenant_themes')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .single();

        if (themeData) {
          setTheme({
            primaryColor: themeData.primary_color,
            secondaryColor: themeData.secondary_color,
            fontFamily: themeData.font_family,
            logoUrl: themeData.logo_url,
            faviconUrl: themeData.favicon_url,
            customCss: themeData.custom_css,
          });
        }

        // Load settings
        const { data: settingsData } = await supabase
          .from('tenant_settings')
          .select('*')
          .eq('organization_id', organizationId)
          .single();

        if (settingsData) {
          setSettings({
            defaultLanguage: settingsData.default_language,
            availableLanguages: settingsData.available_languages,
            customDomain: settingsData.custom_domain,
            features: settingsData.features,
          });
        }
      } catch (error) {
        console.error('Failed to load tenant configuration:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTenantConfig();
  }, [organizationId]);

  // Apply theme to document
  useEffect(() => {
    if (!loading) {
      // Apply custom CSS
      if (theme.customCss) {
        const style = document.createElement('style');
        style.innerHTML = theme.customCss;
        document.head.appendChild(style);
        return () => style.remove();
      }

      // Apply theme variables
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--secondary', theme.secondaryColor);
      document.documentElement.style.fontFamily = theme.fontFamily;

      // Update favicon
      if (theme.faviconUrl) {
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (favicon) {
          favicon.href = theme.faviconUrl;
        }
      }
    }
  }, [theme, loading]);

  return (
    <TenantContext.Provider value={{ theme, settings, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);