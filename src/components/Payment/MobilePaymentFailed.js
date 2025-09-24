import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #EF4444;
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

const TryAgainNote = styled.div`
  background: #fef3c7;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  font-size: 14px;
  color: #92400e;
  border: 1px solid #fbbf24;
`;

const MobilePaymentFailed = () => {
  // Auto-close attempt (will work in some browsers/webviews)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.close();
      } catch (e) {
        // Fallback: try to signal parent window
        if (window.parent && window.parent !== window) {
          window.parent.postMessage('payment-failed', '*');
        }
      }
    }, 2000); // Wait a bit longer for failed payments

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Card>
        <ErrorIcon>✗</ErrorIcon>
        <Title>Payment Failed</Title>
        <Message>
          Your payment could not be processed. Please check your payment method and try again.
        </Message>

        <TryAgainNote>
          <strong>💡 Common Issues:</strong><br />
          • Card declined or expired<br />
          • Insufficient funds<br />
          • Network connection issues
        </TryAgainNote>

        <CloseMessage>
          <strong>Mobile App Users:</strong><br />
          Please close this page and try the payment again in the app.
        </CloseMessage>
      </Card>
    </Container>
  );
};

export default MobilePaymentFailed;