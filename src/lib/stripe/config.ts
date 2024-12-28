import Stripe from 'stripe';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key');
}

export const stripe = new Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PRICE_IDS = {
  STARTER: {
    monthly: 'price_starter_monthly',
    yearly: 'price_starter_yearly',
  },
  PROFESSIONAL: {
    monthly: 'price_pro_monthly',
    yearly: 'price_pro_yearly',
  },
  ENTERPRISE: {
    monthly: 'price_enterprise_monthly',
    yearly: 'price_enterprise_yearly',
  },
} as const;