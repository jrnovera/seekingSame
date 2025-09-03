import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaSearch, FaEye, FaCheckCircle, FaBan, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import UserDetailModal from './UserDetailModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'verified', 'unverified', 'suspended'

  // Fetch all users from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    }, (error) => {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    });

    return () => unsubscribe();
  }, []);

  // Filter users based on search term and status filter
  useEffect(() => {
    let filtered = users;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (statusFilter) {
          case 'verified':
            return user.isVerified === true;
          case 'unverified':
            return user.isVerified === false || user.isVerified === undefined;
          case 'suspended':
            return user.isSuspended === true;
          case 'active':
            return user.isSuspended !== true;
          default:
            return true;
        }
      });
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Header>
        <Title>
          <FaUser />
          <span>Users</span>
        </Title>
        <FilterControls>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterContainer>
            <FilterIcon>
              <FaFilter />
            </FilterIcon>
            <FilterSelect 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </FilterSelect>
          </FilterContainer>
        </FilterControls>
      </Header>

      <UsersGrid>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard key={user.id}>
              <UserAvatar>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} />
                ) : (
                  <FaUser />
                )}
              </UserAvatar>
              <UserInfo>
                <UserNameWrapper>
                  <UserName>{user.displayName || 'Anonymous User'}</UserName>
                  {user.isVerified && <VerifiedBadge title="Verified User"><FaCheckCircle /></VerifiedBadge>}
                </UserNameWrapper>
                <UserEmail>{user.email || 'No email provided'}</UserEmail>
                <StatusContainer>
                  <UserRole>{user.role || 'User'}</UserRole>
                  {user.isSuspended && <SuspendedBadge>Suspended</SuspendedBadge>}
                </StatusContainer>
              </UserInfo>
              <ViewButton onClick={() => handleViewUser(user)}>
                <FaEye />
                <span>View</span>
              </ViewButton>
            </UserCard>
          ))
        ) : (
          <EmptyState>
            <FaUser size={48} />
            <EmptyText>No users found</EmptyText>
          </EmptyState>
        )}
      </UsersGrid>

      {isModalOpen && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #cb54f8;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const FilterContainer = styled.div`
  position: relative;
  width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  z-index: 1;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  appearance: none;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 32px;
    color: #aaa;
  }
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 16px;
  width: 100%;
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const VerifiedBadge = styled.span`
  color: #28a745;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SuspendedBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  background: #dc3545;
  color: white;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
`;

const UserName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  word-break: break-all;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #f6e6fe;
  color: #cb54f8;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #cb54f8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #b83fe0;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #aaa;
`;

const EmptyText = styled.p`
  margin-top: 16px;
  font-size: 18px;
`;

export default Users;
