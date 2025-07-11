"use server";

import Stripe from 'stripe';

// Initialize Stripe with secret key and better error handling
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isDevelopmentMode = !stripeSecretKey || stripeSecretKey.includes('fake_key') || process.env.NODE_ENV === 'development';

if (isDevelopmentMode) {
  console.log('🔧 DEVELOPMENT MODE: Using mock Stripe functionality');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hasStripeKey: !!stripeSecretKey,
    keyType: stripeSecretKey?.includes('fake_key') ? 'fake' : 'real'
  });
}

const stripe = isDevelopmentMode ? null : new Stripe(stripeSecretKey!, {
  apiVersion: '2025-05-28.basil',
});

export interface CheckoutData {
  plan: string;
  period: 'monthly' | 'yearly';
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    plate: string;
  };
}

// Mock functions for development
function createMockCheckoutResponse(data: CheckoutData) {
  const mockId = Date.now().toString();
  const response = {
    subscriptionId: `sub_mock_${mockId}`,
    clientSecret: `pi_mock_${mockId}_secret_mock`,
    customerId: `cus_mock_${mockId}`,
    planInfo: {
      plan: data.plan,
      period: data.period,
    }
  };
  
  console.log('🎭 Generated mock checkout response:', response);
  return response;
}

function createMockPaymentConfirmation(subscriptionId: string) {
  return {
    success: true,
    subscription: {
      id: subscriptionId,
      status: 'active' as const,
      metadata: { plan: 'deluxe', period: 'monthly' }
    },
    paymentMethod: {
      card: { last4: '4242' },
      type: 'card' as const
    },
  };
}

// Plan pricing structure - must match frontend plan.ts pricing
const planPricing = {
  'basic': {
    name: 'Basic',
    monthly: 1999, // $19.99 in cents
    yearly: 19990, // $199.90 in cents (10 months worth)
  },
  'deluxe': {
    name: 'Deluxe',
    monthly: 2499, // $24.99 in cents
    yearly: 24990, // $249.90 in cents (10 months worth)
  },
  'works': {
    name: 'Works',
    monthly: 3499, // $34.99 in cents
    yearly: 34990, // $349.90 in cents (10 months worth)
  },
  'works-plus': {
    name: 'Works+',
    monthly: 3999, // $39.99 in cents
    yearly: 39990, // $399.90 in cents (10 months worth)
  },
};

async function getOrCreatePrice(planKey: string, period: 'monthly' | 'yearly'): Promise<string> {
  if (isDevelopmentMode) {
    return `price_mock_${planKey}_${period}`;
  }
  
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const planInfo = planPricing[planKey as keyof typeof planPricing];
  if (!planInfo) {
    throw new Error(`Invalid plan: ${planKey}`);
  }

  // Check if product already exists
  const existingProducts = await stripe.products.list({
    limit: 100,
  });

  let product = existingProducts.data.find(p => p.metadata.plan_key === planKey);

  // Create product if it doesn't exist
  if (!product) {
    product = await stripe.products.create({
      name: planInfo.name,
      description: `${planInfo.name} subscription plan`,
      metadata: {
        plan_key: planKey,
      },
    });
  }

  // Check if price already exists for this product and period
  const existingPrices = await stripe.prices.list({
    product: product.id,
    limit: 100,
  });

  const intervalMap = { monthly: 'month', yearly: 'year' } as const;
  let price = existingPrices.data.find(p => 
    p.recurring?.interval === intervalMap[period]
  );

  // Create price if it doesn't exist
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: planInfo[period],
      currency: 'usd',
      recurring: {
        interval: intervalMap[period],
      },
      metadata: {
        plan_key: planKey,
        period: period,
      },
    });
  }

  return price.id;
}

async function getOrCreateCoupon(): Promise<string> {
  if (isDevelopmentMode) {
    return 'coupon_mock_first_month_five';
  }
  
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }
  
  try {
    // Check if coupon already exists
    await stripe.coupons.retrieve('first-month-five');
    return 'first-month-five';
      } catch {
      // Create coupon if it doesn't exist
    await stripe.coupons.create({
      id: 'first-month-five',
      name: 'First Month $5 Off',
      amount_off: 500, // $5.00 in cents
      currency: 'usd',
      duration: 'once',
      metadata: {
        description: 'First month discount for Works and Works+ plans',
      },
    });
    return 'first-month-five';
  }
}

export async function createCheckout(data: CheckoutData) {
  try {
    console.log('🚀 createCheckout called with data:', data);
    console.log('🔍 Environment mode:', { isDevelopmentMode, NODE_ENV: process.env.NODE_ENV });
    
    // Development mode - return mock data
    if (isDevelopmentMode) {
      console.log('🎭 Using mock checkout for development mode');
      // Simulate async delay for realistic testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = createMockCheckoutResponse(data);
      console.log('✅ Mock checkout response ready:', mockResponse);
      return mockResponse;
    }

    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    console.log('💳 Using real Stripe API...');
    
    // Get or create the price for this plan and period
    const priceId = await getOrCreatePrice(data.plan, data.period);

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: data.customerInfo.email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: data.customerInfo.email,
        name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
        phone: data.customerInfo.phone,
        metadata: {
          vehicle_make: data.vehicleInfo.make,
          vehicle_model: data.vehicleInfo.model,
          vehicle_year: data.vehicleInfo.year,
          vehicle_color: data.vehicleInfo.color,
          vehicle_plate: data.vehicleInfo.plate,
        },
      });
      customerId = customer.id;
    }

    // Prepare subscription data
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card', 'cashapp'],
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan: data.plan,
        period: data.period,
        vehicle_plate: data.vehicleInfo.plate,
      },
    };

    // Apply coupon for Works and Works+ monthly plans
    if ((data.plan === 'works' || data.plan === 'works-plus') && data.period === 'monthly') {
      const couponId = await getOrCreateCoupon();
      subscriptionData.discounts = [{ coupon: couponId }];
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create(subscriptionData);

    // Handle latest_invoice which can be either a string ID or an expanded object
    const latestInvoice = subscription.latest_invoice;
    if (!latestInvoice) {
      throw new Error('No invoice found on subscription');
    }

    let invoice: Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent | string };
    if (typeof latestInvoice === 'string') {
      // If it's a string ID, retrieve the full invoice
      invoice = await stripe.invoices.retrieve(latestInvoice, {
        expand: ['payment_intent'],
      });
    } else {
      // If it's already an expanded object, use it directly
      invoice = latestInvoice;
    }

    // Access payment_intent with proper type checking
    const paymentIntentRaw = invoice.payment_intent;
    if (!paymentIntentRaw || typeof paymentIntentRaw === 'string') {
      // If no payment intent exists, try to create one manually
      if (!paymentIntentRaw && invoice.id) {
        try {
          const newPaymentIntent = await stripe.paymentIntents.create({
            amount: invoice.amount_due,
            currency: invoice.currency || 'usd',
            customer: customerId,
            payment_method_types: ['card', 'cashapp'],
            metadata: {
              subscription_id: subscription.id,
              invoice_id: invoice.id,
            },
          });
          
          return {
            subscriptionId: subscription.id,
            clientSecret: newPaymentIntent.client_secret,
            customerId: customerId,
          };
                  } catch {
            // Failed to create manual payment intent, will throw error below
          }
      }
      
      throw new Error(`Payment intent not found or not expanded. Type: ${typeof paymentIntentRaw}, Invoice ID: ${invoice.id}`);
    }

    const paymentIntent = paymentIntentRaw as Stripe.PaymentIntent;

    if (!paymentIntent.client_secret) {
      throw new Error('Payment intent missing client_secret');
    }

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      customerId: customerId,
    };
  } catch (error) {
    console.error('💥 Error in createCheckout:', error);
    
    // Better error reporting for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        data: data,
        isDevelopmentMode,
        NODE_ENV: process.env.NODE_ENV
      });
      throw new Error(`Checkout failed: ${error.message}`);
    }
    
    throw new Error('Failed to create checkout session');
  }
}

export async function confirmPayment(subscriptionId: string) {
  try {
    if (isDevelopmentMode) {
      console.log('🚀 Mock payment confirmation for:', subscriptionId);
      // Simulate async delay for realistic testing
      await new Promise(resolve => setTimeout(resolve, 500));
      return createMockPaymentConfirmation(subscriptionId);
    }

    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.status === 'active') {
      // Get payment method details for success page
      const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string, {
        expand: ['payment_intent.payment_method'],
      });
      
      const paymentIntent = (latestInvoice as unknown as { payment_intent: Stripe.PaymentIntent }).payment_intent;
      const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;
      
      return {
        success: true,
        subscription,
        paymentMethod,
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false };
  }
} 