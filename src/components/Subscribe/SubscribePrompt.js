import React from 'react';
import styled from 'styled-components';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19.99,
    priceId: process.env.REACT_APP_BASIC_PRICE_ID || 'price_1S8E67LZklpl5XPjtGWpvWNa',
    currency: 'USD',
    description: 'Essential tools to list properties'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 49.99,
    priceId: process.env.REACT_APP_ADVANCED_PRICE_ID || 'price_1S8EAwLZklpl5XPj98Nk1X2x',
    currency: 'USD',
    description: 'Advanced features for serious hosts'
  },
];

// Debug log to check if environment variables are loaded
console.log('Environment variables check:', {
  REACT_APP_BASIC_PRICE_ID: process.env.REACT_APP_BASIC_PRICE_ID,
  REACT_APP_ADVANCED_PRICE_ID: process.env.REACT_APP_ADVANCED_PRICE_ID,
  plans: plans.map(p => ({ id: p.id, priceId: p.priceId }))
});

const SubscribePrompt = ({ isOpen, onClose, onSelectPlan, loading }) => {
  if (!isOpen) return null;
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Choose a subscription plan</Title>
        <Subtitle>Subscribe to continue adding properties</Subtitle>
        <Plans>
          {plans.map((p) => (
            <PlanCard key={p.id}>
              <PlanName>{p.name}</PlanName>
              <PlanPrice>
                ${p.price.toFixed(2)} <small>{p.currency}/mo</small>
              </PlanPrice>
              <PlanDesc>{p.description}</PlanDesc>
              <SelectBtn disabled={loading} onClick={() => onSelectPlan(p)}>
                {loading ? 'Processing...' : 'Choose ' + p.name}
              </SelectBtn>
            </PlanCard>
          ))}
        </Plans>
        <CancelBtn onClick={onClose} disabled={loading}>Cancel</CancelBtn>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  width: 92%;
  max-width: 640px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

const Title = styled.h3`
  margin: 0 0 6px;
  color: #333;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  color: #666;
`;

const Plans = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`;

const PlanName = styled.h4`
  margin: 0 0 6px;
  color: #333;
`;

const PlanPrice = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #222;

  small { font-size: 12px; color: #777; font-weight: 600; }
`;

const PlanDesc = styled.p`
  color: #666;
`;

const SelectBtn = styled.button`
  background: #cb54f8;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const CancelBtn = styled.button`
  margin-top: 16px;
  background: #f8f9fa;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
`;

export default SubscribePrompt;
