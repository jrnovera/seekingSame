import React from 'react';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <Card>
      <CardHeader>
        <IconWrapper color={color}>
          <Icon />
        </IconWrapper>
        {trend && (
          <TrendIndicator isPositive={trend.isPositive}>
            {trend.isPositive ? <FaArrowUp /> : <FaArrowDown />}
            {trend.value}%
          </TrendIndicator>
        )}
      </CardHeader>
      
      <CardBody>
        <Value>{value}</Value>
        <Title>{title}</Title>
      </CardBody>
    </Card>
  );
};

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => `${props.color}20`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 20px;

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
  background: ${props => props.isPositive ? '#28a74520' : '#dc354520'};
  padding: 4px 8px;
  border-radius: 20px;
`;

const CardBody = styled.div`
  text-align: left;
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Title = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export default StatsCard;
