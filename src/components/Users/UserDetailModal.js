import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaIdCard, FaCalendarAlt, FaTimes, FaCheckCircle, FaBan, FaExclamationTriangle, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const UserDetailModal = ({ user, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  
  // Toggle user verification status
  const toggleVerification = async () => {
    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', userData.id);
      const newStatus = !userData.isVerified;
      
      await updateDoc(userRef, {
        isVerified: newStatus
      });
      
      setUserData({
        ...userData,
        isVerified: newStatus
      });
      
      toast.success(`User ${newStatus ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Failed to update verification status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle user suspension status
  const toggleSuspension = async () => {
    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', userData.id);
      const newStatus = !userData.isSuspended;
      
      await updateDoc(userRef, {
        isSuspended: newStatus
      });
      
      setUserData({
        ...userData,
        isSuspended: newStatus
      });
      
      toast.success(`User ${newStatus ? 'suspended' : 'unsuspended'} successfully`);
    } catch (error) {
      console.error('Error updating suspension status:', error);
      toast.error('Failed to update suspension status');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore timestamps
      if (timestamp.toDate) {
        return new Date(timestamp.toDate()).toLocaleDateString();
      }
      // Handle regular dates or timestamps
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>User Details</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <UserProfile>
          <UserAvatar>
            {userData.photoURL ? (
              <img src={userData.photoURL} alt={userData.displayName || 'User'} />
            ) : (
              <FaUser size={40} />
            )}
          </UserAvatar>
          <UserNameContainer>
            <UserName>{userData.displayName || 'Anonymous User'}</UserName>
            {userData.isVerified && <VerifiedBadge title="Verified User"><FaCheckCircle /></VerifiedBadge>}
          </UserNameContainer>
          <StatusBadges>
            <UserRole>{userData.role || 'User'}</UserRole>
            {userData.isSuspended && <SuspendedBadge><FaBan /> Suspended</SuspendedBadge>}
            {!userData.isVerified && <UnverifiedBadge><FaExclamationTriangle /> Unverified</UnverifiedBadge>}
          </StatusBadges>
        </UserProfile>
        
        <DetailSection>
          <DetailItem>
            <DetailIcon>
              <FaEnvelope />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Email</DetailLabel>
              <DetailValue>{userData.email || 'No email provided'}</DetailValue>
            </DetailContent>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaIdCard />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>ID Document</DetailLabel>
              <DetailValue>
                {userData.idDocument ? (
                  <a href={userData.idDocument} target="_blank" rel="noopener noreferrer">
                    View Document
                  </a>
                ) : 'No document provided'}
              </DetailValue>
            </DetailContent>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaCalendarAlt />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Joined</DetailLabel>
              <DetailValue>{formatDate(userData.createdAt)}</DetailValue>
            </DetailContent>
          </DetailItem>
        </DetailSection>
        
        {userData.bio && (
          <BioSection>
            <BioTitle>About</BioTitle>
            <BioContent>{userData.bio}</BioContent>
          </BioSection>
        )}
        
        <AdminControlsSection>
          <AdminControlsTitle>Admin Controls</AdminControlsTitle>
          
          <AdminControlsRow>
            <AdminControlLabel>
              Verification Status
              <StatusIndicator isActive={userData.isVerified}>
                {userData.isVerified ? 'Verified' : 'Unverified'}
              </StatusIndicator>
            </AdminControlLabel>
            
            <ToggleButton 
              onClick={toggleVerification} 
              disabled={isLoading}
              title={userData.isVerified ? 'Unverify User' : 'Verify User'}
            >
              {isLoading ? 'Processing...' : userData.isVerified ? 
                <><FaToggleOn color="#28a745" size={20} /> Verified</> : 
                <><FaToggleOff color="#6c757d" size={20} /> Unverified</>
              }
            </ToggleButton>
          </AdminControlsRow>
          
          <AdminControlsRow>
            <AdminControlLabel>
              Account Status
              <StatusIndicator isActive={!userData.isSuspended}>
                {userData.isSuspended ? 'Suspended' : 'Active'}
              </StatusIndicator>
            </AdminControlLabel>
            
            <ToggleButton 
              onClick={toggleSuspension} 
              disabled={isLoading}
              title={userData.isSuspended ? 'Unsuspend User' : 'Suspend User'}
            >
              {isLoading ? 'Processing...' : !userData.isSuspended ? 
                <><FaToggleOn color="#28a745" size={20} /> Active</> : 
                <><FaToggleOff color="#dc3545" size={20} /> Suspended</>
              }
            </ToggleButton>
          </AdminControlsRow>
        </AdminControlsSection>
        
        <CloseButtonFull onClick={onClose}>Close</CloseButtonFull>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

const UserProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  background: #f9f1ff;
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    color: #aaa;
  }
`;

const UserNameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const UserName = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const VerifiedBadge = styled.span`
  color: #28a745;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const StatusBadges = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SuspendedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #dc3545;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const UnverifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #ffc107;
  color: #212529;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 16px;
  background: white;
  color: #cb54f8;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
`;

const DetailSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f6e6fe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #cb54f8;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0 0 4px;
`;

const DetailValue = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  word-break: break-all;
`;

const ViewDocumentLink = styled.a`
  color: #cb54f8;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BioSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const BioTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
`;

const BioContent = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

const AdminControlsSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const AdminControlsTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
`;

const AdminControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AdminControlLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
  color: #333;
`;

const StatusIndicator = styled.span`
  font-size: 13px;
  font-weight: normal;
  color: ${props => props.isActive ? '#28a745' : '#dc3545'};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9f9f9;
    border-color: #ccc;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CloseButtonFull = styled.button`
  width: 100%;
  padding: 12px;
  background: #f6e6fe;
  color: #cb54f8;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #efd6fe;
  }
`;

export default UserDetailModal;
