import { loadStripe } from '@stripe/stripe-js';

// IMPORTANT: Use only the publishable (public) key on the client
// Read from env (Create React App exposes REACT_APP_* to the client)
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_PUBLISHABLE_KEY) {
  // Throwing here helps catch misconfiguration early in development
  // Do NOT put any secret key in the client bundle
  throw new Error('Missing REACT_APP_STRIPE_PUBLISHABLE_KEY. Add it to your .env file.');
}

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Start Stripe Checkout by requesting a Checkout Session from your backend,
 * then redirecting the browser to Stripe.
 *
 * Backend requirement (example endpoint):
 *   POST /api/create-checkout-session
 *   body: {
 *     priceId?: string, // If you have price ids configured in Stripe
 *     amount?: number,  // Fallback: pass amount in cents for one-time
 *     currency: 'usd',
 *     mode: 'subscription' | 'payment',
 *     metadata: { userId, email, planId, planName }
 *   }
 *   returns { id: '<session_id>' }
 */
export async function startCheckout(plan, user) {
  const stripe = await getStripe();

  // Try to create a Checkout Session via your backend
  // Adjust the URL to match your backend server (Netlify Function, Vercel, or custom server)
  // First try the proxy URL, then fallback to direct URL with port 4244
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '/api/create-checkout-session';
  // Fallback URL if proxy fails
  const fallbackUrl = 'http://localhost:4244/api/create-checkout-session';

  const payload = {
    // Pass amount in cents for the server to create price
    amount: Math.round(plan.price * 100), // cents
    currency: 'usd',
    mode: 'subscription',
    metadata: {
      userId: user?.id,
      email: user?.email,
      name: user?.display_name || user?.name,
      planId: plan.id,
      planName: plan.name,
    },
    // Success/cancel URLs are set server-side with session_id parameter
    // The CheckoutHandler component will process these URLs when Stripe redirects back
  };

  // Try the primary URL first
  let data;
  try {
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.warn(`Primary URL failed: ${text}, trying fallback...`);
      throw new Error('Primary URL failed');
    }
  } catch (err) {
    console.warn(`Error with primary URL: ${err.message}, trying fallback...`);
    
    // Try the fallback URL
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!fallbackRes.ok) {
      const text = await fallbackRes.text();
      throw new Error(`Stripe backend error: ${text}`);
    }
    
    data = await fallbackRes.json();
  }
  
  if (!data?.id) {
    throw new Error('No session id returned from backend');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
  if (error) {
    throw error;
  }
}
