```typescript
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createSubscription(priceId: string) {
  const { data: { session_id } } = await supabase.functions.invoke('create-subscription', {
    body: { priceId }
  });

  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: session_id });
}

export async function updateSubscription(subscriptionId: string, newPriceId: string) {
  return await supabase.functions.invoke('update-subscription', {
    body: { subscriptionId, newPriceId }
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await supabase.functions.invoke('cancel-subscription', {
    body: { subscriptionId }
  });
}

export async function getInvoices(organizationId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```