import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye, FaBed, FaBath, FaMapMarkerAlt, FaUsers, FaPhone, FaEnvelope } from 'react-icons/fa';

const PropertyCard = ({ property, onEdit, onDelete, onView }) => {
  const getStatusColor = (isAvailable) => {
    return isAvailable ? '#28a745' : '#dc3545';
  };

  const getStatusText = (isAvailable) => {
    return isAvailable ? 'Available' : 'Unavailable';
  };

  return (
    <Card>
      <ImageContainer>
        <PropertyImage src={property.photo || property.image} alt={property.name} />
        <StatusBadge isAvailable={property.isAvailable}>
          {getStatusText(property.isAvailable)}
        </StatusBadge>
      </ImageContainer>
      
      <CardContent>
        <PropertyHeader>
          <PropertyTitle>{property.name}</PropertyTitle>
          <PropertyType>{property.categories}</PropertyType>
        </PropertyHeader>
        
        <PropertyAddress>
          <FaMapMarkerAlt />
          {property.cities}
        </PropertyAddress>
        
        <PropertyDetails>
          <DetailItem>
            <FaBed />
            <span>{property.bedroomCount} bed</span>
          </DetailItem>
          <DetailItem>
            <FaBath />
            <span>{property.BathRoomCount} bath</span>
          </DetailItem>
          <DetailItem>
            <FaUsers />
            <span>{property.capacity} people</span>
          </DetailItem>
        </PropertyDetails>
        
        <PropertyRent>${property.price}/month</PropertyRent>
        
        {property.deposit > 0 && (
          <DepositInfo>
            <DepositLabel>Deposit:</DepositLabel>
            <DepositAmount>${property.deposit}</DepositAmount>
          </DepositInfo>
        )}

        <ContactInfo>
          {property.email && (
            <ContactItem>
              <FaEnvelope />
              <span>{property.email}</span>
            </ContactItem>
          )}
          {property.phoneNumber && (
            <ContactItem>
              <FaPhone />
              <span>{property.phoneNumber}</span>
            </ContactItem>
          )}
        </ContactInfo>
        
        <CardActions>
          <ActionButton onClick={onView} color="#17a2b8">
            <FaEye />
          </ActionButton>
          <ActionButton onClick={onEdit} color="#ffc107">
            <FaEdit />
          </ActionButton>
          <ActionButton onClick={onDelete} color="#dc3545">
            <FaTrash />
          </ActionButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.isAvailable ? '#28a745' : '#dc3545'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const PropertyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const PropertyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
`;

const PropertyType = styled.span`
  background: #e9ecef;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const PropertyAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;

  svg {
    font-size: 12px;
  }
`;

const PropertyDetails = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;

  svg {
    font-size: 14px;
  }
`;

const PropertyRent = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #cb54f8;
  margin-bottom: 15px;
`;

const DepositInfo = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DepositLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const DepositAmount = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ContactInfo = styled.div`
  margin-bottom: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 12px;
  margin-bottom: 5px;

  svg {
    font-size: 12px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => `${props.color}20`};
  color: ${props => props.color};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
  }
`;

export default PropertyCard;
