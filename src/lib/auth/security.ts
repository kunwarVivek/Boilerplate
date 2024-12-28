import { supabase } from '../supabase';

export interface SecuritySettings {
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  mfaRequired: boolean;
  sessionTimeout: number;
}

export async function getSecuritySettings(organizationId: string): Promise<SecuritySettings> {
  const { data, error } = await supabase
    .from('organization_settings')
    .select('security_settings')
    .eq('organization_id', organizationId)
    .single();

  if (error) throw error;
  return data?.security_settings || {
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    mfaRequired: false,
    sessionTimeout: 30
  };
}

export function validatePassword(password: string, settings: SecuritySettings): boolean {
  if (password.length < settings.passwordMinLength) return false;
  if (settings.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (settings.requireNumbers && !/\d/.test(password)) return false;
  if (settings.requireSpecialChars && !/[!@#$%^&*]/.test(password)) return false;
  return true;
}

export async function enforceSessionTimeout(organizationId: string): Promise<void> {
  const settings = await getSecuritySettings(organizationId);
  const lastActivity = localStorage.getItem('lastActivity');
  
  if (lastActivity) {
    const timeSinceActivity = (Date.now() - parseInt(lastActivity)) / 1000 / 60;
    if (timeSinceActivity > settings.sessionTimeout) {
      await supabase.auth.signOut();
      throw new Error('Session expired');
    }
  }
  
  localStorage.setItem('lastActivity', Date.now().toString());
}