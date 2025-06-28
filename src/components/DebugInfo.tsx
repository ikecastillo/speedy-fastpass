"use client";

import React from 'react';

export function DebugInfo() {
  // Only show in development or when explicitly enabled
  const showDebug = process.env.NODE_ENV === 'development' || 
                    process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true';

  if (!showDebug) {
    return null;
  }

  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-3 rounded-lg shadow-lg max-w-xs z-50">
      <div className="font-bold mb-2">🔧 Debug Info</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">Environment:</span> {process.env.NODE_ENV}
        </div>
        <div>
          <span className="text-gray-300">Vercel:</span> {process.env.VERCEL ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <span className="text-gray-300">Stripe Key:</span>{' '}
          {stripePublishableKey ? 
            (stripePublishableKey.includes('fake_key') ? '❌ Fake' : '✅ Set') : 
            '❌ Missing'
          }
        </div>
        <div>
          <span className="text-gray-300">LocalStorage:</span>{' '}
          {typeof window !== 'undefined' ? '✅ Available' : '❌ SSR'}
        </div>
      </div>
    </div>
  );
} 