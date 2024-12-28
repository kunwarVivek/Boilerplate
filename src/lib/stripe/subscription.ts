import { stripe } from './config';
import { supabase } from '../supabase';

export async function createSubscription(organizationId: string, priceId: string) {
  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', organizationId)
    .single();

  if (!org?.stripe_customer_id) {
    throw new Error('Organization not configured for billing');
  }

  const subscription = await stripe.subscriptions.create({
    customer: org.stripe_customer_id,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  await supabase.from('organization_subscriptions').insert({
    organization_id: organizationId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
  });

  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  await supabase
    .from('organization_subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('stripe_subscription_id', subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
  });
}