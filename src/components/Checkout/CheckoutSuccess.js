import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const SuccessCard = styled.div`
  background: white;
  color: #333;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
`;

const CheckmarkIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  &::after {
    content: '✓';
    font-size: 40px;
    color: white;
    font-weight: bold;
  }
`;

const Title = styled.h1`
  margin: 0 0 10px;
  color: #4caf50;
`;

const Message = styled.p`
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #666;
`;

const SessionId = styled.div`
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  margin: 20px 0;
  word-break: break-all;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a67d8;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract session_id from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
      console.log('Checkout completed with session ID:', sessionIdFromUrl);
      
      // Here you could make an API call to verify the payment
      // and update the user's subscription status
      verifyPayment(sessionIdFromUrl);
    } else {
      console.error('No session ID found in URL');
    }
    
    setLoading(false);
  }, [location]);

  const verifyPayment = async (sessionId) => {
    try {
      // Optional: Call your backend to verify the payment
      const STRIPE_BACKEND_URL = process.env.REACT_APP_STRIPE_BACKEND_URL || 'http://localhost:3001';
      
      // You could add an endpoint to verify the session
      // const response = await fetch(`${STRIPE_BACKEND_URL}/api/payments/verify-session/${sessionId}`);
      // const result = await response.json();
      
      console.log('Payment verification completed for session:', sessionId);
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard'); // or wherever you want to redirect after success
  };

  const handleViewReceipt = () => {
    // Navigate to a receipt/invoice page or open Stripe receipt
    navigate('/transactions'); // or your transactions page
  };

  if (loading) {
    return (
      <SuccessContainer>
        <SuccessCard>
          <LoadingSpinner />
          <p>Processing your payment...</p>
        </SuccessCard>
      </SuccessContainer>
    );
  }

  return (
    <SuccessContainer>
      <SuccessCard>
        <CheckmarkIcon />
        <Title>Payment Successful!</Title>
        <Message>
          Thank you for your payment. Your subscription has been activated successfully.
          You should receive a confirmation email shortly.
        </Message>
        
        {sessionId && (
          <>
            <Message>
              <strong>Transaction ID:</strong>
            </Message>
            <SessionId>{sessionId}</SessionId>
          </>
        )}

        <div>
          <Button onClick={handleContinue}>
            Continue to Dashboard
          </Button>
          <Button onClick={handleViewReceipt}>
            View Receipt
          </Button>
        </div>
      </SuccessCard>
    </SuccessContainer>
  );
}

export default CheckoutSuccess;