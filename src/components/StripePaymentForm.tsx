"use client";

import React from "react";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from "next/navigation";

interface StripePaymentFormProps {
  planName: string;
  period: 'monthly' | 'yearly';
  subscriptionId: string;
}

export function StripePaymentForm({ planName, period, subscriptionId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  // Check if we're in development mode with mock data
  const isDevelopmentMode = subscriptionId.includes('mock');
  
  console.log('💳 StripePaymentForm initialized:', {
    planName,
    period,
    subscriptionId,
    isDevelopmentMode,
    hasStripe: !!stripe,
    hasElements: !!elements
  });

  // Set ready state when Stripe is loaded or in development mode
  React.useEffect(() => {
    if (isDevelopmentMode) {
      setIsReady(true);
      console.log('✅ Development mode - payment form ready');
    } else if (stripe && elements) {
      setIsReady(true);
      console.log('✅ Stripe loaded - payment form ready');
    } else {
      console.log('⏳ Waiting for Stripe to load...');
    }
  }, [stripe, elements, isDevelopmentMode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('💰 Payment form submitted');

    // Development mode - simulate payment success
    if (isDevelopmentMode) {
      console.log('🎭 Simulating payment success in development mode');
      setIsProcessing(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store mock payment success
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentSuccess', JSON.stringify({
          subscriptionId,
          timestamp: new Date().toISOString(),
          planName,
          period,
          mockPayment: true
        }));
      }
      
      console.log('✅ Mock payment completed, redirecting to success page');
      router.push(`/checkout/success?subscription_id=${subscriptionId}`);
      return;
    }

    if (!isDevelopmentMode && (!stripe || !elements)) {
      console.error('❌ Stripe not ready:', { stripe: !!stripe, elements: !!elements });
      setErrorMessage('Payment system not ready. Please refresh the page and try again.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not properly initialized');
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?subscription_id=${subscriptionId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Store payment success for success page
        if (typeof window !== 'undefined') {
          localStorage.setItem('paymentSuccess', JSON.stringify({
            subscriptionId,
            timestamp: new Date().toISOString(),
            planName,
            period
          }));
        }
        
        router.push(`/checkout/success?subscription_id=${subscriptionId}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/checkout/vehicle');
  };

  const handleTestCard = () => {
    if (isDevelopmentMode) {
      setErrorMessage('This is a development environment. Click "Complete Payment" to simulate a successful payment.');
    } else {
      setErrorMessage('Use test card 4242 4242 4242 4242 with any future expiry and CVC to test.');
    }
  };

  // Show loading state while Stripe initializes
  if (!isReady) {
    return (
      <div className="bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Payment Information
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment form...</p>
            <p className="text-sm text-gray-500 mt-2">
              {isDevelopmentMode ? 'Initializing demo mode' : 'Connecting to Stripe'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Development Mode Notice */}
        {isDevelopmentMode && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="font-medium text-blue-900">Development Mode</h3>
            </div>
            <p className="text-sm text-blue-800">
              This is a simulated payment environment. No real charges will be made. 
              Click &quot;Complete Payment&quot; to simulate a successful transaction.
            </p>
          </div>
        )}

        {/* Stripe Payment Element or Mock Form */}
        {!isDevelopmentMode ? (
          <div className="p-4 border border-gray-200 rounded-lg">
            <PaymentElement 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    name: 'auto',
                    email: 'auto',
                  },
                },
                wallets: {
                  applePay: 'auto',
                  googlePay: 'never',
                },
              }}
            />
          </div>
        ) : (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-gray-600 font-medium">Mock Payment Form</p>
              <p className="text-sm text-gray-500 mt-1">
                Development environment - no payment processing
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-brand" role="status" aria-live="polite">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span>
              {isDevelopmentMode ? 'Simulating...' : 'Processing payment...'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {/* Test Card Button */}
          <button
            type="button"
            onClick={handleTestCard}
            disabled={isProcessing}
            className="px-6 py-3 bg-accent text-gray-800 rounded-lg font-medium hover:bg-yellow-500 transition-colors border border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 {isDevelopmentMode ? 'Dev Info' : 'Test Card Info'}
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className={`
              flex-1 px-8 py-3 rounded-lg font-medium transition-colors
              ${
                isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-blue-900"
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isDevelopmentMode ? 'Simulating...' : 'Processing...'}
              </span>
            ) : (
              `Complete Payment ${isDevelopmentMode ? '(Mock)' : ''}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 