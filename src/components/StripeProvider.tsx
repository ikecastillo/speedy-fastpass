"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_fake_key_replace_with_real_stripe_publishable_key'
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#1e40af',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  } : {};

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
} 