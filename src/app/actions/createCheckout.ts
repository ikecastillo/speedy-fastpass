"use server";

import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_replace_with_real_stripe_secret_key', {
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

// Plan pricing structure
const planPricing = {
  'basic': {
    name: 'Basic Wash',
    monthly: 999, // $9.99 in cents
    yearly: 9900, // $99.00 in cents
  },
  'deluxe': {
    name: 'Deluxe Wash',
    monthly: 1499, // $14.99 in cents
    yearly: 14900, // $149.00 in cents
  },
  'works': {
    name: 'The Works',
    monthly: 1999, // $19.99 in cents
    yearly: 19900, // $199.00 in cents
  },
  'works-plus': {
    name: 'The Works+',
    monthly: 2499, // $24.99 in cents
    yearly: 24900, // $249.00 in cents
  },
};

async function getOrCreatePrice(planKey: string, period: 'monthly' | 'yearly'): Promise<string> {
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
  try {
    // Check if coupon already exists
    await stripe.coupons.retrieve('first-month-five');
    return 'first-month-five';
  } catch (error) {
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

    let invoice: any;
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
                  } catch (piError) {
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
    console.error('Error creating checkout:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function confirmPayment(subscriptionId: string) {
  try {
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