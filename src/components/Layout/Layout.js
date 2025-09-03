import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Container>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent sidebarOpen={sidebarOpen}>
        <Header onToggleSidebar={toggleSidebar} />
        <Content>
          <Outlet />
        </Content>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;

  @media (min-width: 769px) {
    margin-left: ${props => props.sidebarOpen ? '0' : '0'};
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export default Layout;
