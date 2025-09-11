import React from 'react';
import styled from 'styled-components';
import { FaMoneyCheckAlt, FaComments, FaUserCheck } from 'react-icons/fa';

const Notifications = () => {
  // Static notifications only (mock data)
  const items = [
    {
      id: 'NTF-001',
      type: 'rent',
      title: 'Rent Payment Received',
      message: 'John Doe paid September rent for Sunnyvale Apartment 2B.',
      time: 'Today • 10:24 AM'
    },
    {
      id: 'NTF-002',
      type: 'deposit',
      title: 'Security Deposit Paid',
      message: 'Jane Smith paid the deposit for Downtown Loft 5A.',
      time: 'Yesterday • 6:42 PM'
    },
    {
      id: 'NTF-003',
      type: 'message',
      title: 'New Message',
      message: 'Alex Johnson sent you a message about Cozy Cottage.',
      time: 'Yesterday • 3:15 PM'
    },
    {
      id: 'NTF-004',
      type: 'rent',
      title: 'Rent Payment Received',
      message: 'Emily Clark paid August rent for Lakeside Studio.',
      time: 'Aug 31 • 9:03 AM'
    },
  ];

  const iconFor = (type) => {
    switch (type) {
      case 'rent':
        return <IconWrap $type={type}><FaMoneyCheckAlt /></IconWrap>;
      case 'deposit':
        return <IconWrap $type={type}><FaUserCheck /></IconWrap>;
      case 'message':
        return <IconWrap $type={type}><FaComments /></IconWrap>;
      default:
        return <IconWrap><FaComments /></IconWrap>;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Notifications</Title>
        <Subtitle>Static demo of rent, deposit, and message alerts</Subtitle>
      </Header>

      <List>
        {items.map((n) => (
          <Item key={n.id}>
            {iconFor(n.type)}
            <Content>
              <TopRow>
                <ItemTitle>{n.title}</ItemTitle>
                <Time>{n.time}</Time>
              </TopRow>
              <Message>{n.message}</Message>
              <Tags>
                <Tag $type={n.type}>{n.type.toUpperCase()}</Tag>
                <TagLight>#{n.id}</TagLight>
              </Tags>
            </Content>
          </Item>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  @media (max-width: 768px) { padding: 16px; }
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0 0 6px 0;
  font-size: 22px;
  color: #333;
  @media (max-width: 768px) { font-size: 20px; }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #777;
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  background: ${p => p.$type === 'rent' ? '#28a745' : p.$type === 'deposit' ? '#17a2b8' : '#cb54f8'};
`;

const Content = styled.div`
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemTitle = styled.div`
  font-weight: 700;
  color: #222;
`;

const Time = styled.div`
  margin-left: auto;
  color: #999;
  font-size: 12px;
`;

const Message = styled.div`
  color: #444;
  margin-top: 4px;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$type === 'rent' ? '#155724' : p.$type === 'deposit' ? '#0c5460' : '#6f42c1'};
  background: ${p => p.$type === 'rent' ? '#d4edda' : p.$type === 'deposit' ? '#d1ecf1' : '#efe6ff'};
  border: 1px solid ${p => p.$type === 'rent' ? '#c3e6cb' : p.$type === 'deposit' ? '#bee5eb' : '#e2d6ff'};
  border-radius: 999px;
  padding: 4px 8px;
`;

const TagLight = styled.span`
  font-size: 11px;
  color: #666;
  background: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 999px;
  padding: 4px 8px;
`;

export default Notifications;
