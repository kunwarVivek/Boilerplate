```typescript
import { supabase } from '../supabase';
import { authenticator } from 'otplib';

export async function enableMFA(userId: string) {
  const secret = authenticator.generateSecret();
  
  const { error } = await supabase
    .from('user_mfa')
    .insert({
      user_id: userId,
      secret,
      enabled: false
    });

  if (error) throw error;
  return secret;
}

export async function verifyMFA(userId: string, token: string) {
  const { data, error } = await supabase
    .from('user_mfa')
    .select('secret')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  
  const isValid = authenticator.verify({
    token,
    secret: data.secret
  });

  if (isValid) {
    await supabase
      .from('user_mfa')
      .update({ enabled: true })
      .eq('user_id', userId);
  }

  return isValid;
}

export async function validateMFAToken(userId: string, token: string) {
  const { data, error } = await supabase
    .from('user_mfa')
    .select('secret')
    .eq('user_id', userId)
    .eq('enabled', true)
    .single();

  if (error) throw error;

  return authenticator.verify({
    token,
    secret: data.secret
  });
}
```