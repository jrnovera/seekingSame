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

// Get Firebase Auth token for API calls
async function getFirebaseToken() {
  try {
    const { auth } = await import('../firebase');
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get ID token for the authenticated user
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    throw new Error('Authentication required for checkout');
  }
}

/**
 * Start Stripe Checkout by calling the dedicated stripe-backend-server
 * 
 * API Endpoint: POST /api/payments/create-checkout-session
 * Required headers: Authorization: Bearer <firebase-token>
 * Body: {
 *   userId: string,
 *   priceId: string, // Stripe Price ID from dashboard
 *   mode: 'subscription' | 'payment',
 *   metadata?: object
 * }
 * Returns: { success: true, data: { sessionId: string, url: string } }
 */
export async function startCheckout(plan, user) {
  try {
    // Get Firebase authentication token
    const firebaseToken = await getFirebaseToken();
    
    // Stripe backend server URL
    const STRIPE_BACKEND_URL = process.env.REACT_APP_STRIPE_BACKEND_URL || 'http://localhost:3001';
    const checkoutUrl = `${STRIPE_BACKEND_URL}/api/payments/create-checkout-session`;
    
    // Prepare payload for the new API
    const payload = {
      userId: user?.uid || user?.id, // Firebase UID
      priceId: plan.priceId, // Stripe Price ID from your dashboard
      mode: plan.mode || 'subscription', // Default to subscription
      metadata: {
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        userEmail: user?.email,
        userName: user?.display_name || user?.displayName || user?.name
      },
      // Simple URLs without Stripe placeholders - Stripe will append session_id automatically
      successUrl: `${window.location.origin}/checkout-success`,
      cancelUrl: `${window.location.origin}/checkout-cancel`
    };

    console.log('Plan object received:', plan);
    console.log('Creating checkout session with payload:', payload);

    if (!payload.priceId) {
      console.error('ERROR: priceId is missing from payload!', {
        plan,
        priceId: plan.priceId,
        envVars: {
          REACT_APP_BASIC_PRICE_ID: process.env.REACT_APP_BASIC_PRICE_ID,
          REACT_APP_ADVANCED_PRICE_ID: process.env.REACT_APP_ADVANCED_PRICE_ID
        }
      });
      throw new Error('Price ID is missing. Please check environment variables.');
    }

    // Call the stripe-backend-server API
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe backend error:', errorText);
      throw new Error(`Stripe backend error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data?.sessionId) {
      console.error('Invalid response from stripe backend:', result);
      throw new Error('Invalid response from payment server');
    }

    console.log('Checkout session created successfully:', result.data.sessionId);

    // Redirect to Stripe Checkout using the session ID
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({ 
      sessionId: result.data.sessionId 
    });
    
    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }

  } catch (error) {
    console.error('Checkout process failed:', error);
    throw error;
  }
}
