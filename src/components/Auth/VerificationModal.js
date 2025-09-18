import React from 'react';
import styled from 'styled-components';
import { FaShieldAlt, FaSignOutAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const VerificationModal = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // page will redirect via route guards
    } catch (e) {
      // no-op
    }
  };

  return (
    <Overlay>
      <Modal>
        <IconWrap>
          <FaShieldAlt size={36} />
        </IconWrap>
        <Title>Account Pending Verification</Title>
        <Message>
          <FaClock style={{ marginRight: 6 }} />
          Please wait while an admin verifies your account.
        </Message>
        <Subtext>
          We will send you an email once your account has been verified. You can log out for now and sign back in later.
        </Subtext>
        {user?.email && (
          <InfoRow>
            Signed in as <strong>{user.email}</strong>
          </InfoRow>
        )}
        <Actions>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            Log out
          </LogoutButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  width: 92%;
  max-width: 520px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6e6fe;
  color: #cb54f8;
`;

const Title = styled.h3`
  margin: 8px 0 6px;
  color: #333;
`;

const Message = styled.div`
  color: #444;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Subtext = styled.p`
  color: #666;
  margin: 8px 0 0;
`;

const InfoRow = styled.p`
  color: #777;
  margin: 10px 0 0;
`;

const Actions = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoutButton = styled.button`
  background: #f8f9fa;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #eef0f2; }
`;

export default VerificationModal;
