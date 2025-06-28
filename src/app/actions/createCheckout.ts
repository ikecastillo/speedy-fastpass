"use server";

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

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

export async function createCheckout(data: CheckoutData) {
  try {
    // Map plan and period to Stripe price IDs
    // In production, these would be real Stripe price IDs
    const priceMap: Record<string, Record<string, string>> = {
      'basic': {
        'monthly': 'price_basic_monthly',
        'yearly': 'price_basic_yearly',
      },
      'deluxe': {
        'monthly': 'price_deluxe_monthly',
        'yearly': 'price_deluxe_yearly',
      },
      'works': {
        'monthly': 'price_works_monthly',
        'yearly': 'price_works_yearly',
      },
      'works-plus': {
        'monthly': 'price_works_plus_monthly',
        'yearly': 'price_works_plus_yearly',
      },
    };

    const priceId = priceMap[data.plan]?.[data.period];
    if (!priceId) {
      throw new Error('Invalid plan or period');
    }

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
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan: data.plan,
        period: data.period,
        vehicle_plate: data.vehicleInfo.plate,
      },
    };

    // Apply coupon for Works and Works+ monthly plans
    if ((data.plan === 'works' || data.plan === 'works-plus') && data.period === 'monthly') {
      subscriptionData.discounts = [{ coupon: 'first-month-five' }]; // This coupon would need to be created in Stripe dashboard
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create(subscriptionData);

    // Extract client secret from payment intent
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (latestInvoice as any).payment_intent as Stripe.PaymentIntent;

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
      
      const paymentIntent = (latestInvoice as any).payment_intent as Stripe.PaymentIntent;
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