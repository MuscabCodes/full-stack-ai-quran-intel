const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { protect } = require('./auth');

const router = express.Router();

// Create subscription
router.post('/create-subscription', protect, async (req, res) => {
  try {
    const { plan, paymentMethodId } = req.body;
    
    const plans = {
      premium: { price: 999, interval: 'month' }, // $9.99
      scholar: { price: 1999, interval: 'month' } // $19.99
    };

    if (!plans[plan]) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid plan selected'
      });
    }

    // Create Stripe customer if not exists
    let customerId = req.user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.stripeCustomerId': customerId
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            description: `AIQuranIntel ${plan} subscription`
          },
          unit_amount: plans[plan].price,
          recurring: {
            interval: plans[plan].interval
          }
        }
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    // Update user subscription
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': plan,
      'subscription.status': 'active'
    });

    res.json({
      status: 'success',
      data: {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Cancel subscription
router.post('/cancel-subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.subscription.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.subscription.stripeCustomerId,
        status: 'active'
      });

      if (subscriptions.data.length > 0) {
        await stripe.subscriptions.cancel(subscriptions.data[0].id);
      }
    }

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': 'free',
      'subscription.status': 'canceled'
    });

    res.json({
      status: 'success',
      message: 'Subscription canceled successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;