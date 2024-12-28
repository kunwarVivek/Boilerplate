import { supabase } from '../supabase';

export interface BrandingSettings {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export async function updateBranding(
  organizationId: string,
  settings: Partial<BrandingSettings>
) {
  const { error } = await supabase
    .from('organizations')
    .update({
      branding: settings,
    })
    .eq('id', organizationId);

  if (error) throw error;
}

export async function uploadBrandingAsset(
  organizationId: string,
  file: File,
  type: 'logo' | 'favicon'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${organizationId}/${type}.${fileExt}`;

  const { error: uploadError, data } = await supabase.storage
    .from('branding')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('branding')
    .getPublicUrl(fileName);

  await updateBranding(organizationId, {
    [type === 'logo' ? 'logoUrl' : 'faviconUrl']: publicUrl,
  });

  return publicUrl;
}