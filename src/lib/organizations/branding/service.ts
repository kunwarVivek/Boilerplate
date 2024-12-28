import { supabase } from '@/lib/supabase';

export interface BrandingConfig {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
}

export async function getBrandingConfig(organizationId: string): Promise<BrandingConfig | null> {
  const { data, error } = await supabase
    .from('tenant_themes')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    primaryColor: data.primary_color,
    accentColor: data.secondary_color,
    logoUrl: data.logo_url,
    faviconUrl: data.favicon_url,
    customCss: data.custom_css,
  };
}

export async function updateBrandingConfig(
  organizationId: string,
  config: Partial<BrandingConfig>
): Promise<void> {
  const { error } = await supabase
    .from('tenant_themes')
    .upsert({
      organization_id: organizationId,
      primary_color: config.primaryColor,
      secondary_color: config.accentColor,
      logo_url: config.logoUrl,
      favicon_url: config.faviconUrl,
      custom_css: config.customCss,
      is_active: true,
    });

  if (error) throw error;
}

export async function uploadBrandingAsset(
  organizationId: string,
  file: File,
  type: 'logo' | 'favicon'
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${organizationId}/${type}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('branding')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('branding')
    .getPublicUrl(fileName);

  await updateBrandingConfig(organizationId, {
    [type === 'logo' ? 'logoUrl' : 'faviconUrl']: publicUrl,
  });

  return publicUrl;
}