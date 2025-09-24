import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaBars, FaUser, FaSignOutAlt, FaBell, FaMoneyCheckAlt, FaComments, FaUserCheck } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [openNotif, setOpenNotif] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const notifications = [
    { id: 'NTF-001', type: 'rent', title: 'Rent Payment Received', detail: 'John Doe paid September rent.', time: '10:24 AM' },
    { id: 'NTF-002', type: 'deposit', title: 'Security Deposit Paid', detail: 'Jane Smith paid the deposit.', time: 'Yesterday' },
    { id: 'NTF-003', type: 'message', title: 'New Message', detail: 'Alex Johnson sent you a message.', time: '3:15 PM' },
  ];

  const iconFor = (type) => {
    switch (type) {
      case 'rent':
        return <NotifIcon $type={type}><FaMoneyCheckAlt /></NotifIcon>;
      case 'deposit':
        return <NotifIcon $type={type}><FaUserCheck /></NotifIcon>;
      case 'message':
        return <NotifIcon $type={type}><FaComments /></NotifIcon>;
      default:
        return <NotifIcon><FaComments /></NotifIcon>;
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <FaBars />
        </MenuButton>
      
      </LeftSection>
      
      <RightSection>
        <NotifWrapper>
          <NotificationButton onClick={() => setOpenNotif(v => !v)} aria-label="Notifications">
            <FaBell />
            <NotificationBadge>{notifications.length}</NotificationBadge>
          </NotificationButton>
          {openNotif && (
            <NotificationsDropdown>
              <DropdownHeader>Notifications</DropdownHeader>
              <DropdownList>
                {notifications.map(n => (
                  <DropdownItem key={n.id}>
                    {iconFor(n.type)}
                    <ItemContent>
                      <ItemTitle>{n.title}</ItemTitle>
                      <ItemDetail>{n.detail}</ItemDetail>
                      <ItemMeta>{n.time} • <ItemTag $type={n.type}>{n.type}</ItemTag></ItemMeta>
                    </ItemContent>
                  </DropdownItem>
                ))}
              </DropdownList>
              <DropdownFooter>
                <FooterLink href="#">View all</FooterLink>
              </DropdownFooter>
            </NotificationsDropdown>
          )}
        </NotifWrapper>
        
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

const NotifWrapper = styled.div`
  position: relative;
`;

const NotificationsDropdown = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 320px;
  max-height: 70vh;
  background: #fff;
  border: 1px solid #e9ecef;
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 90vw;
    right: -10px;
  }
`;

const DropdownHeader = styled.div`
  padding: 12px 14px;
  font-weight: 700;
  color: #333;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const DropdownList = styled.div`
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #fafafa;

  &:hover { background: #faf7ff; }
`;

const NotifIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: ${p => p.$type === 'rent' ? '#28a745' : p.$type === 'deposit' ? '#17a2b8' : '#cb54f8'};
`;

const ItemContent = styled.div``;
const ItemTitle = styled.div`
  font-weight: 700;
  color: #222;
`;
const ItemDetail = styled.div`
  color: #555;
  font-size: 13px;
  margin-top: 2px;
`;
const ItemMeta = styled.div`
  color: #999;
  font-size: 12px;
  margin-top: 6px;
`;
const ItemTag = styled.span`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;
  color: ${p => p.$type === 'rent' ? '#155724' : p.$type === 'deposit' ? '#0c5460' : '#6f42c1'};
`;

const DropdownFooter = styled.div`
  padding: 10px 14px;
  border-top: 1px solid #eee;
  background: #fff;
`;

const FooterLink = styled.a`
  color: #6f42c1;
  text-decoration: none;
  font-weight: 600;
  &:hover { text-decoration: underline; }
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
