import { supabase } from '../supabase';

export interface SessionInfo {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  lastActive: string;
  expiresAt: string;
}

export async function trackSession(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userId,
      user_agent: navigator.userAgent,
      ip_address: await getClientIP(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

  if (error) throw error;
}

export async function getActiveSessions(userId: string): Promise<SessionInfo[]> {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString());

  if (error) throw error;
  return data;
}

export async function terminateSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('user_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}