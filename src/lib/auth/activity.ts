import { supabase } from '../supabase';

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export async function trackUserActivity(
  userId: string,
  action: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  const { error } = await supabase
    .from('user_activities')
    .insert({
      user_id: userId,
      action,
      metadata,
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent
    });

  if (error) throw error;
}

export async function getUserActivities(
  userId: string,
  limit: number = 50
): Promise<UserActivity[]> {
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
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