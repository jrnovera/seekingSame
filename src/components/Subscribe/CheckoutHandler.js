import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// This component handles the redirect from Stripe checkout
// It processes URL params and creates subscription records on success
const CheckoutHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const handleCheckoutResult = async () => {
      // Get URL search params
      const params = new URLSearchParams(location.search);
      const checkoutStatus = params.get('checkout');
      const sessionId = params.get('session_id');
      const planId = params.get('plan');
      
      console.log('Checkout result:', { checkoutStatus, sessionId, planId });
      
      if (!checkoutStatus) return; // Not a checkout redirect
      
      if (checkoutStatus === 'success' && sessionId) {
        try {
          
          // Create subscription record in Firestore
          await addDoc(collection(db, 'subscriber'), {
            user: doc(db, 'users', user.id),
            userId: user.id,
            email: user.email || null,
            planId: planId || 'basic',
            planName: planId === 'pro' ? 'Pro' : 'Basic',
            price: planId === 'pro' ? 49.99 : 19.99,
            currency: 'USD',
            status: 'active',
            stripeSessionId: sessionId,
            createdAt: serverTimestamp(),
          });
          
          // Update user's subscription status
          await updateDoc(doc(db, 'users', user.id), {
            isSubscribe: true,
            subscribedPlan: planId || 'basic',
            subscribedAt: serverTimestamp()
          })
          
          toast.success('Subscription activated successfully!');
          
          // Redirect to properties page to continue adding a property
          navigate('/properties');
        } catch (error) {
          console.error('Error creating subscription:', error);
          toast.error('Failed to activate subscription. Please contact support.');
        }
      } else if (checkoutStatus === 'cancel') {
        toast.error('Transaction canceled or failed. Please try again.');
        navigate('/properties');
      }
      
      // Clear the URL parameters after processing
      window.history.replaceState({}, document.title, location.pathname);
    };
    
    handleCheckoutResult();
  }, [location, navigate, user]);
  
  // This component doesn't render anything visible
  return null;
};

export default CheckoutHandler;
