import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
  color: white;
`;

const Title = styled.h1`
  color: #1f2937;
  margin: 0 0 16px;
  font-size: 28px;
  font-weight: bold;
`;

const Message = styled.p`
  color: #6b7280;
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.6;
`;

const CloseMessage = styled.div`
  background: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  margin-top: 24px;
  font-size: 14px;
  color: #374151;
`;

const MobilePaymentSuccess = () => {
  // Auto-close attempt (will work in some browsers/webviews)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.close();
      } catch (e) {
        // Fallback: try to signal parent window
        if (window.parent && window.parent !== window) {
          window.parent.postMessage('payment-success', '*');
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Card>
        <SuccessIcon>✓</SuccessIcon>
        <Title>Payment Successful!</Title>
        <Message>
          Your payment has been processed successfully. Thank you for your payment!
        </Message>

        <CloseMessage>
          <strong>Mobile App Users:</strong><br />
          You can now close this page and return to the app.
        </CloseMessage>
      </Card>
    </Container>
  );
};

export default MobilePaymentSuccess;