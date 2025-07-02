"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

// Better environment variable handling with warnings
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const isDevelopmentMode = !stripePublishableKey || stripePublishableKey.includes('fake_key') || process.env.NODE_ENV === 'development';

if (isDevelopmentMode) {
  console.log('🔧 STRIPE PROVIDER: Running in development mode with mock Stripe');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hasPublishableKey: !!stripePublishableKey,
    keyType: stripePublishableKey?.includes('fake_key') ? 'fake' : stripePublishableKey ? 'real' : 'missing'
  });
}

const stripePromise = loadStripe(
  stripePublishableKey || 'pk_test_fake_key_replace_with_real_stripe_publishable_key'
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  console.log('🏗️ StripeProvider rendering with clientSecret:', clientSecret ? 'present' : 'missing');
  
  // In development mode with mock client secret, provide a simple wrapper
  if (isDevelopmentMode && clientSecret?.includes('mock')) {
    console.log('🎭 Using mock Stripe provider for development');
    return (
      <div data-mock-stripe-provider="true">
        {children}
      </div>
    );
  }
  
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#1e40af',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '16px',
        fontSizeBase: '16px',
        spacingUnit: '4px',
        borderRadius: '8px',
        fontWeightNormal: '400',
        fontWeightMedium: '500',
      },
      rules: {
        '.Input': {
          fontSize: '16px',
          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        '.Tab': {
          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: '500',
        },
        '.Text': {
          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
  } : {};

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
} 