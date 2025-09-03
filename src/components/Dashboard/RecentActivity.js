import React from 'react';
import styled from 'styled-components';
import { FaBuilding, FaUsers, FaDollarSign, FaTools, FaUserPlus } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_property':
        return FaBuilding;
      case 'tenant_moved':
        return FaUsers;
      case 'payment':
        return FaDollarSign;
      case 'maintenance':
        return FaTools;
      case 'new_tenant':
        return FaUserPlus;
      default:
        return FaBuilding;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_property':
        return '#cb54f8';
      case 'tenant_moved':
        return '#28a745';
      case 'payment':
        return '#ffc107';
      case 'maintenance':
        return '#17a2b8';
      case 'new_tenant':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

  return (
    <ActivityContainer>
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        const color = getActivityColor(activity.type);
        
        return (
          <ActivityItem key={activity.id}>
            <ActivityIcon color={color}>
              <Icon />
            </ActivityIcon>
            <ActivityContent>
              <ActivityMessage>{activity.message}</ActivityMessage>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        );
      })}
    </ActivityContainer>
  );
};

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => `${props.color}20`};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 16px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityMessage = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #666;
`;

export default RecentActivity;
