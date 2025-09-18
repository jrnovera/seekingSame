// Simple Express backend for Stripe Checkout with error handling
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// For testing only - in production, use environment variables instead
const stripeSecretKey = 'sk_test_51S3PJXLZklpl5XPjnDnHqbGIjCfnGULTP6QHCaOFijEBaj9Ob0iGHZTpdcGJWk5G8mfnt1JKXS5grD67YvGFFbaz00OUW75WWY';
let stripe;

try {
  const Stripe = require('stripe');
  stripe = new Stripe(stripeSecretKey);
  console.log('Stripe initialized with test key');
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check received');
  res.json({ ok: true });
});

// Create a Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  console.log('Checkout request received:', req.body);
  
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not initialized' });
  }
  
  try {
    // For testing, just return a mock session ID
    // This will allow the frontend to proceed without actual Stripe API calls
    return res.json({ id: 'test_session_' + Date.now() });
    
    /* Uncomment this for real Stripe integration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Subscription',
            },
            unit_amount: 1999, // $19.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/?checkout=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/?checkout=cancel',
    });
    return res.json({ id: session.id });
    */
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: err.message || 'Error creating checkout session' });
  }
});

// Try different ports if 4242 is in use
const tryPorts = [4242, 4243, 4244, 4245];

function startServer(portIndex = 0) {
  if (portIndex >= tryPorts.length) {
    console.error('Could not start server on any of the attempted ports');
    return;
  }
  
  const port = tryPorts[portIndex];
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Test the server with: curl http://localhost:${port}/api/health`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying next port...`);
      startServer(portIndex + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
