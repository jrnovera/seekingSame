import React from 'react';
import styled from 'styled-components';

const Transactions = () => {
  const data = [
    { id: 'TXN-001', property: 'Sunnyvale Apartment 2B', tenant: 'John Doe', date: '2025-08-15', amount: 1800.0, status: 'Paid' },
    { id: 'TXN-002', property: 'Downtown Loft 5A', tenant: 'Jane Smith', date: '2025-08-12', amount: 2200.0, status: 'Pending' },
    { id: 'TXN-003', property: 'Cozy Cottage', tenant: 'Alex Johnson', date: '2025-08-01', amount: 1500.0, status: 'Paid' },
    { id: 'TXN-004', property: 'Sunnyvale Apartment 2B', tenant: 'John Doe', date: '2025-07-15', amount: 1800.0, status: 'Paid' },
    { id: 'TXN-005', property: 'Downtown Loft 5A', tenant: 'Jane Smith', date: '2025-07-12', amount: 2200.0, status: 'Paid' },
  ];

  return (
    <Container>
      <Header>
        <Title>Transactions</Title>
        <Subtitle>Static view of recent property transactions</Subtitle>
      </Header>

      <Cards>
        <StatCard>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{data.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Collected</StatLabel>
          <StatValue>
            ${data.filter(d => d.status === 'Paid').reduce((s, d) => s + d.amount, 0).toLocaleString()}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Pending</StatLabel>
          <StatValue>{data.filter(d => d.status === 'Pending').length}</StatValue>
        </StatCard>
      </Cards>

      {/* Desktop/Tablet table */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Property</th>
              <th>Tenant</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.property}</td>
                <td>{row.tenant}</td>
                <td>{row.date}</td>
                <td>${row.amount.toLocaleString()}</td>
                <td>
                  <Status $type={row.status}>{row.status}</Status>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Mobile card list */}
      <MobileList>
        {data.map((row) => (
          <MobileCard key={row.id}>
            <MobileRow>
              <MobileLabel>Transaction ID</MobileLabel>
              <MobileValue>{row.id}</MobileValue>
            </MobileRow>
            <MobileRow>
              <MobileLabel>Property</MobileLabel>
              <MobileValue>{row.property}</MobileValue>
            </MobileRow>
            <MobileRow>
              <MobileLabel>Tenant</MobileLabel>
              <MobileValue>{row.tenant}</MobileValue>
            </MobileRow>
            <MobileRow>
              <MobileLabel>Date</MobileLabel>
              <MobileValue>{row.date}</MobileValue>
            </MobileRow>
            <MobileRow>
              <MobileLabel>Amount</MobileLabel>
              <MobileValue>${row.amount.toLocaleString()}</MobileValue>
            </MobileRow>
            <MobileRow>
              <MobileLabel>Status</MobileLabel>
              <MobileValue>
                <Status $type={row.status}>{row.status}</Status>
              </MobileValue>
            </MobileRow>
          </MobileCard>
        ))}
      </MobileList>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  @media (max-width: 768px) { padding: 16px; }
`;

// Mobile card layout
const MobileList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: grid;
    gap: 12px;
  }
`;

const MobileCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px;
`;

const MobileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  &:not(:last-child) {
    border-bottom: 1px dashed #f0f0f0;
  }
`;

const MobileLabel = styled.span`
  color: #777;
  font-size: 12px;
`;

const MobileValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0 0 6px 0;
  font-size: 22px;
  color: #333;
  @media (max-width: 768px) { font-size: 20px; }
  @media (max-width: 480px) { font-size: 18px; }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #777;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
`;

const StatLabel = styled.div`
  color: #777;
  font-size: 13px;
`;

const StatValue = styled.div`
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
  @media (max-width: 768px) { font-size: 18px; }
  @media (max-width: 480px) { font-size: 16px; }
`;

const TableWrapper = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  /* Enable horizontal scroll on small screens */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  /* Force horizontal scroll when viewport is narrow */
  min-width: 720px;

  thead th {
    text-align: left;
    background: #f8f9fa;
    color: #555;
    font-weight: 600;
    padding: 12px 14px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    /* Sticky header on mobile */
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody td {
    padding: 14px;
    border-bottom: 1px solid #f1f1f1;
    color: #444;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #faf7ff;
  }

  @media (max-width: 768px) {
    thead th { font-size: 13px; padding: 10px 12px; }
    tbody td { font-size: 13px; padding: 12px; }
  }

  @media (max-width: 480px) {
    min-width: 640px;
    thead th { font-size: 12px; padding: 8px 10px; }
    tbody td { font-size: 12px; padding: 10px; }
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => (p.$type === 'Paid' ? '#155724' : '#856404')};
  background: ${p => (p.$type === 'Paid' ? '#d4edda' : '#fff3cd')};
  border: 1px solid ${p => (p.$type === 'Paid' ? '#c3e6cb' : '#ffeeba')};
`;

export default Transactions;
