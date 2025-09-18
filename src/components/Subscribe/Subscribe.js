import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUserTie, FaEnvelope, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Subscribe = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'subscriber'), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // sort newest first by createdAt if available
      items.sort((a, b) => {
        const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dbb = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dbb - da;
      });
      setSubs(items);
      setLoading(false);
    }, (err) => {
      console.error('Failed to load subscribers', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total = subs.length;
  const activeCount = subs.filter(s => (s.status || 'active') === 'active').length;
  const trialCount = subs.filter(s => s.status === 'trial').length;

  return (
    <Container>
      <Header>
        <Title>Subscribed Hosts</Title>
        <Subtitle>These hosts are currently subscribed to your admin account</Subtitle>
      </Header>

      <Cards>
        <StatCard>
          <StatLabel>Total Subscribed</StatLabel>
          <StatValue>{total}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Active</StatLabel>
          <StatValue>{activeCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>On Trial</StatLabel>
          <StatValue>{trialCount}</StatValue>
        </StatCard>
      </Cards>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Host</th>
              <th>Email</th>
              <th>Subscribed Since</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4}>Loading...</td></tr>
            ) : total === 0 ? (
              <tr><td colSpan={4}>No subscribers found</td></tr>
            ) : (
              subs.map((h) => {
                const since = h.createdAt?.toDate ? h.createdAt.toDate() : (h.createdAt ? new Date(h.createdAt) : null);
                const displayName = h.name || h.planName || 'Host';
                return (
                  <tr key={h.id}>
                    <td>
                      <HostCell>
                        <Avatar>
                          <FaUserTie />
                        </Avatar>
                        <span>{displayName}</span>
                      </HostCell>
                    </td>
                    <td>
                      <EmailCell>
                        <FaEnvelope />
                        <span>{h.email || '—'}</span>
                      </EmailCell>
                    </td>
                    <td>
                      <SinceCell>
                        <FaCalendarCheck />
                        <span>{since ? since.toLocaleDateString() : '—'}</span>
                      </SinceCell>
                    </td>
                    <td>
                      <StatusBadge $type={h.status || 'active'}>
                        <FaCheckCircle />
                        <span>{h.status || 'active'}</span>
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0 0 6px 0;
  font-size: 22px;
  color: #333;
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
`;

const TableWrapper = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;

  thead th {
    text-align: left;
    background: #f8f9fa;
    color: #555;
    font-weight: 600;
    padding: 12px 14px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
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
`;

const HostCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
`;

const EmailCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #555;
`;

const SinceCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #555;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => (p.$type === 'active' ? '#155724' : '#856404')};
  background: ${p => (p.$type === 'active' ? '#d4edda' : '#fff3cd')};
  border: 1px solid ${p => (p.$type === 'active' ? '#c3e6cb' : '#ffeeba')};
  text-transform: capitalize;
`;

export default Subscribe;
