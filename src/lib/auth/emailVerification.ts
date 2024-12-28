import { supabase } from '../supabase';

export async function sendVerificationEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/verify-email`,
    },
  });

  if (error) throw error;
}

export async function verifyEmail(token: string) {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  });

  if (error) throw error;
}