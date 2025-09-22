import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'incoming', or 'outgoing'
  const [paidToFilter, setPaidToFilter] = useState(''); // ID of user to filter by in paidTo field

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Build role-based query for subscriber collection
    const baseCol = collection(db, 'subscriber');
    const isAdmin = (user.role || '').toLowerCase() === 'admin';
    const q = isAdmin
      ? query(baseCol, orderBy('createdAt', 'desc'))
      : query(baseCol, where('userId', '==', user.id));

    const unsub = onSnapshot(q, (snap) => {
      try {
        let items = snap.docs.map((d) => {
          const data = d.data() || {};
          const createdAtVal = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date());
          // Determine transaction type relative to current user
          const rowType = isAdmin ? 'incoming' : 'outgoing';
          const normalizedStatus = (data.status || 'Paid');

          return {
            id: d.id,
            userId: data.userId || data.user?.id || '',
            type: rowType, // admin sees incoming revenue; user sees outgoing payment
            description: data.planName ? `Subscription - ${data.planName}` : 'Subscription',
            date: createdAtVal,
            amount: data.price || 0,
            status: normalizedStatus === 'active' ? 'Paid' : normalizedStatus,
            property: undefined
          };
        });

        // Sort client-side by date desc if we did not orderBy in the query
        items.sort((a, b) => (new Date(b.date)) - (new Date(a.date)));

        setTransactions(items);
        setLoading(false);
      } catch (e) {
        console.error('Error processing subscriber records:', e);
        setError('Failed to load transactions. Please try again later.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error loading subscriber records:', err);
      setError('Failed to load transactions. Please try again later.');
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // Apply simple client-side filters for type and userId (paidToFilter input)
  useEffect(() => {
    const isAdmin = (user?.role || '').toLowerCase() === 'admin';
    let list = [...transactions];

    if (filter !== 'all') {
      list = list.filter((t) => t.type === filter);
    }

    if (paidToFilter) {
      // For admin, filter any userId. For non-admin it will already be their own
      list = list.filter((t) => (t.userId || '').toLowerCase().includes(paidToFilter.toLowerCase()));
    }

    setFilteredTransactions(list);
  }, [transactions, filter, paidToFilter, user]);

  // We no longer need this effect since filtering is now done at query time
  // through the fetchUserTransactions function with options

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const handlePaidToFilterChange = (userId) => {
    setPaidToFilter(userId);
  };
  
  const clearFilters = () => {
    setFilter('all');
    setPaidToFilter('');
  };

  return (
    <Container>
      <Header>
        <Title>Transactions</Title>
        <Subtitle>Your transaction history</Subtitle>
      </Header>
      
      <FilterSection>
        <FilterLabel>Transaction Type</FilterLabel>
        <FilterContainer>
          <FilterButton 
            $active={filter === 'all'} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            $active={filter === 'incoming'} 
            onClick={() => handleFilterChange('incoming')}
          >
            Received
          </FilterButton>
          <FilterButton 
            $active={filter === 'outgoing'} 
            onClick={() => handleFilterChange('outgoing')}
          >
            Sent
          </FilterButton>
        </FilterContainer>
        
        <FilterLabel>Filter by User</FilterLabel>
        <FilterRow>
          <UserFilterInput 
            type="text" 
            placeholder="Enter user ID to filter" 
            value={paidToFilter} 
            onChange={(e) => handlePaidToFilterChange(e.target.value)} 
          />
          {(filter !== 'all' || paidToFilter) && (
            <ClearFiltersButton onClick={clearFilters}>
              Clear Filters
            </ClearFiltersButton>
          )}
        </FilterRow>
        {paidToFilter && (
          <ActiveFilter>
            Filtering by user: <FilterHighlight>{paidToFilter}</FilterHighlight>
            <RemoveFilterButton onClick={() => setPaidToFilter('')}>×</RemoveFilterButton>
          </ActiveFilter>
        )}
      </FilterSection>

      <Cards>
        <StatCard>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{filteredTransactions.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Received</StatLabel>
          <StatValue>
            ${filteredTransactions
              .filter(d => d.type === 'incoming' && d.status === 'Paid')
              .reduce((s, d) => s + (parseFloat(d.amount) || 0), 0)
              .toLocaleString()}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Sent</StatLabel>
          <StatValue>
            ${filteredTransactions
              .filter(d => d.type === 'outgoing' && d.status === 'Paid')
              .reduce((s, d) => s + (parseFloat(d.amount) || 0), 0)
              .toLocaleString()}
          </StatValue>
        </StatCard>
      </Cards>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading transactions...</LoadingText>
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState>
          <EmptyStateText>No transactions found</EmptyStateText>
          <EmptyStateSubtext>Transactions will appear here once you send or receive payments</EmptyStateSubtext>
        </EmptyState>
      ) : (

      <>
        {/* Desktop/Tablet table */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((row) => (
                <tr key={row.id}>
                  <td>{row.id.substring(0, 8)}...</td>
                  <td>
                    <TransactionType $type={row.type}>
                      {row.type === 'incoming' ? 'Received' : 'Sent'}
                    </TransactionType>
                  </td>
                  <td>{row.description || (row.property ? `Payment for ${row.property}` : 'Transaction')}</td>
                  <td>{row.date instanceof Date ? row.date.toLocaleDateString() : 
                      typeof row.date === 'object' && row.date?.toDate ? 
                      row.date.toDate().toLocaleDateString() : 
                      new Date(row.date).toLocaleDateString()}</td>
                  <td>
                    <Amount $type={row.type}>
                      {row.type === 'incoming' ? '+' : '-'}${parseFloat(row.amount).toLocaleString()}
                    </Amount>
                  </td>
                  <td>
                    <Status $type={row.status || 'Paid'}>{row.status || 'Paid'}</Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {/* Mobile card list */}
        <MobileList>
          {filteredTransactions.map((row) => (
            <MobileCard key={row.id}>
              <MobileRow>
                <MobileLabel>Transaction ID</MobileLabel>
                <MobileValue>{row.id.substring(0, 8)}...</MobileValue>
              </MobileRow>
              <MobileRow>
                <MobileLabel>Type</MobileLabel>
                <MobileValue>
                  <TransactionType $type={row.type}>
                    {row.type === 'incoming' ? 'Received' : 'Sent'}
                  </TransactionType>
                </MobileValue>
              </MobileRow>
              <MobileRow>
                <MobileLabel>Description</MobileLabel>
                <MobileValue>{row.description || (row.property ? `Payment for ${row.property}` : 'Transaction')}</MobileValue>
              </MobileRow>
              <MobileRow>
                <MobileLabel>Date</MobileLabel>
                <MobileValue>
                  {row.date instanceof Date ? row.date.toLocaleDateString() : 
                   typeof row.date === 'object' && row.date?.toDate ? 
                   row.date.toDate().toLocaleDateString() : 
                   new Date(row.date).toLocaleDateString()}
                </MobileValue>
              </MobileRow>
              <MobileRow>
                <MobileLabel>Amount</MobileLabel>
                <MobileValue>
                  <Amount $type={row.type}>
                    {row.type === 'incoming' ? '+' : '-'}${parseFloat(row.amount).toLocaleString()}
                  </Amount>
                </MobileValue>
              </MobileRow>
              <MobileRow>
                <MobileLabel>Status</MobileLabel>
                <MobileValue>
                  <Status $type={row.status || 'Paid'}>{row.status || 'Paid'}</Status>
                </MobileValue>
              </MobileRow>
            </MobileCard>
          ))}
        </MobileList>
      </>)}
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

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const UserFilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const ClearFiltersButton = styled.button`
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f1f1;
  }
`;

const ActiveFilter = styled.div`
  display: inline-flex;
  align-items: center;
  background: #f0f4ff;
  border: 1px solid #d0d8ff;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  color: #555;
  margin-bottom: 16px;
`;

const FilterHighlight = styled.span`
  font-weight: 600;
  color: #6c5ce7;
  margin: 0 4px;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 0 0 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #666;
  }
`;

const FilterButton = styled.button`
  background: ${p => p.$active ? '#6c5ce7' : '#f8f9fa'};
  color: ${p => p.$active ? '#fff' : '#666'};
  border: 1px solid ${p => p.$active ? '#6c5ce7' : '#ddd'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$active ? '#6c5ce7' : '#f1f1f1'};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6c5ce7;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  margin: 0;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: #f9f9f9;
  border-radius: 10px;
  border: 1px dashed #ddd;
`;

const EmptyStateText = styled.h3`
  color: #555;
  margin: 0 0 10px 0;
`;

const EmptyStateSubtext = styled.p`
  color: #888;
  margin: 0;
  text-align: center;
`;

const TransactionType = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => (p.$type === 'incoming' ? '#155724' : '#721c24')};
  background: ${p => (p.$type === 'incoming' ? '#d4edda' : '#f8d7da')};
  border: 1px solid ${p => (p.$type === 'incoming' ? '#c3e6cb' : '#f5c6cb')};
`;

const Amount = styled.span`
  color: ${p => (p.$type === 'incoming' ? '#28a745' : '#dc3545')};
  font-weight: 600;
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
