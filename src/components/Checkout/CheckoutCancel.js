import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CancelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  text-align: center;
`;

const CancelCard = styled.div`
  background: white;
  color: #333;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
`;

const CancelIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ff5722;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  &::after {
    content: '✕';
    font-size: 40px;
    color: white;
    font-weight: bold;
  }
`;

const Title = styled.h1`
  margin: 0 0 10px;
  color: #ff5722;
`;

const Message = styled.p`
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #666;
`;

const Button = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const SecondaryButton = styled(Button)`
  background: #666;
  
  &:hover {
    background: #555;
  }
`;

function CheckoutCancel() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/subscribe'); // or wherever your subscription page is
  };

  const handleReturnHome = () => {
    navigate('/dashboard'); // or your main page
  };

  const handleContactSupport = () => {
    // Navigate to support page or open email
    navigate('/support');
    // Or open email client
    // window.location.href = 'mailto:support@yourdomain.com?subject=Payment Issue';
  };

  return (
    <CancelContainer>
      <CancelCard>
        <CancelIcon />
        <Title>Payment Cancelled</Title>
        <Message>
          Your payment was cancelled and no charges were made to your account.
          You can try again or contact support if you need assistance.
        </Message>
        
        <Message>
          <strong>Need help?</strong> Our support team is here to assist you with any questions 
          about pricing or payment issues.
        </Message>

        <div>
          <Button onClick={handleTryAgain}>
            Try Again
          </Button>
          <SecondaryButton onClick={handleReturnHome}>
            Return Home
          </SecondaryButton>
          <SecondaryButton onClick={handleContactSupport}>
            Contact Support
          </SecondaryButton>
        </div>
      </CancelCard>
    </CancelContainer>
  );
}

export default CheckoutCancel;