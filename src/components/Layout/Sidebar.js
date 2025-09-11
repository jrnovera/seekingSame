import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaBuilding, FaCog, FaTimes, FaUsers, FaMoneyBill, FaBell } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/properties', icon: FaBuilding, label: 'Properties' },
    { path: '/notifications', icon: FaBell, label: 'Notifications', hostOnly: true },
    { path: '/transactions', icon: FaMoneyBill, label: 'Transactions', hostOnly: true },
    { path: '/chat', icon: AiOutlineMessage, label: 'Chat', hostOnly: true },
    { path: '/users', icon: FaUsers, label: 'Users', adminOnly: true },
    { path: '/settings', icon: FaCog, label: 'Settings' }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'admin';
    }
    if (item.hostOnly) {
      return user?.role === 'host' || user?.role === 'admin';
    }
    return true;
  });

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo>
            <FaBuilding size={24} />
            <LogoText>seeking same</LogoText>
          </Logo>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </SidebarHeader>
        
        <Navigation>
          {filteredMenuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <item.icon />
              <NavText>{item.label}</NavText>
            </NavItem>
          ))}
        </Navigation>
      </SidebarContainer>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: ${props => props.isOpen ? 'block' : 'none'};

  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;

  @media (min-width: 769px) {
    position: relative;
    transform: translateX(0);
    box-shadow: none;
  }

  @media (max-width: 480px) {
    width: 260px;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cb54f8;
  font-weight: 700;
  font-size: 18px;
`;

const LogoText = styled.span`
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  padding: 20px 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #f9f1ff;
    color: #cb54f8;
  }

  &.active {
    background-color: #f6e6fe;
    color: #cb54f8;
    border-left-color: #cb54f8;
    font-weight: 600;
  }

  svg {
    font-size: 18px;
  }
`;

const NavText = styled.span`
  font-size: 16px;
`;

export default Sidebar;
