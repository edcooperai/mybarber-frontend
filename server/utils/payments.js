import Stripe from 'stripe';
import { logger } from './logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async ({
  amount,
  currency = 'gbp',
  customer,
  metadata
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/pence
      currency,
      customer,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    });

    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error('Failed to create payment intent:', error);
    throw error;
  }
};

export const createCustomer = async ({ email, name, phone, metadata }) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata
    });

    logger.info(`Stripe customer created: ${customer.id}`);
    return customer;
  } catch (error) {
    logger.error('Failed to create Stripe customer:', error);
    throw error;
  }
};

export const handleWebhook = async (body, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }

    return event;
  } catch (error) {
    logger.error('Webhook error:', error);
    throw error;
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  // Update appointment status, send confirmation, etc.
  logger.info(`Payment succeeded: ${paymentIntent.id}`);
};

const handlePaymentFailure = async (paymentIntent) => {
  // Handle failed payment, notify user, etc.
  logger.error(`Payment failed: ${paymentIntent.id}`);
};