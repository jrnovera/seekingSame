import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaBars, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <FaBars />
        </MenuButton>
        <Title>seeking same</Title>
      </LeftSection>
      
      <RightSection>
        <NotificationButton>
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </NotificationButton>
        
        <UserSection>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>Administrator</UserRole>
          </UserInfo>
          <UserAvatar>
            <FaUser />
          </UserAvatar>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
          </LogoutButton>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: white;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 0 15px;
    height: 60px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #cb54f8;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc3545;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  text-align: right;

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #cb54f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
    color: #dc3545;
  }
`;

export default Header;
