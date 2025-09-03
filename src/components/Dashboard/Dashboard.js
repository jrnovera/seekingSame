import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBuilding, FaUsers, FaDollarSign, FaEye, FaPlus, FaArrowUp, FaArrowDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import PropertyChart from './PropertyChart';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    unavailableProperties: 0,
    totalRevenue: 0,
    averagePrice: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);

  // Fetch properties data
  useEffect(() => {
    const q = query(collection(db, 'property'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propertiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProperties(propertiesData);
      
      // Calculate stats
      const totalProperties = propertiesData.length;
      const availableProperties = propertiesData.filter(p => p.isAvailable).length;
      const unavailableProperties = totalProperties - availableProperties;
      const totalRevenue = propertiesData.reduce((sum, p) => sum + (p.price || 0), 0);
      const averagePrice = totalProperties > 0 ? Math.round(totalRevenue / totalProperties) : 0;
      
      setStats({
        totalProperties,
        availableProperties,
        unavailableProperties,
        totalRevenue,
        averagePrice
      });
      
      // Set recent properties (last 5)
      setRecentProperties(propertiesData.slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  // Helper functions for stats
  const getCategoryStats = () => {
    const categoryCount = {};
    properties.forEach(property => {
      const category = property.categories || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  };

  const getCityStats = () => {
    const cityCount = {};
    properties.forEach(property => {
      const city = property.cities || 'Unknown';
      cityCount[city] = (cityCount[city] || 0) + 1;
    });
    return Object.entries(cityCount).map(([name, count]) => ({ name, count })).slice(0, 5);
  };

  return (
    <DashboardContainer>


      <DashboardHeader>
        <HeaderLeft>
          <LogoImage src="/logo192.png" alt="Logo" />
          <Title>Dashboard Overview</Title>
        </HeaderLeft>
      </DashboardHeader>

      <StatsGrid>
        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={FaBuilding}
          color="#cb54f8"
        />
        <StatsCard
          title="Available"
          value={stats.availableProperties}
          icon={FaCheckCircle}
          color="#28a745"
        />
        <StatsCard
          title="Unavailable"
          value={stats.unavailableProperties}
          icon={FaTimesCircle}
          color="#dc3545"
        />
        <StatsCard
          title="Average Price"
          value={`$${stats.averagePrice.toLocaleString()}`}
          icon={FaDollarSign}
          color="#ffc107"
        />
      </StatsGrid>

      <ContentGrid>
        <ChartSection>
          <SectionTitle>Property Performance</SectionTitle>
          <PropertyChart properties={properties} />
        </ChartSection>

        <ActivitySection>
          <SectionTitle>Recent Properties</SectionTitle>
          <RecentPropertiesList>
            {recentProperties.map(property => (
              <PropertyItem key={property.id}>
                <PropertyImage src={property.photo || 'https://via.placeholder.com/60x60'} alt={property.name} />
                <PropertyInfo>
                  <PropertyName>{property.name}</PropertyName>
                  <PropertyDetails>
                    <PropertyLocation>{property.cities}</PropertyLocation>
                    <PropertyPrice>${property.price}/month</PropertyPrice>
                  </PropertyDetails>
                  <PropertyStatus isAvailable={property.isAvailable}>
                    {property.isAvailable ? 'Available' : 'Unavailable'}
                  </PropertyStatus>
                </PropertyInfo>
              </PropertyItem>
            ))}
            {recentProperties.length === 0 && (
              <EmptyMessage>No properties found</EmptyMessage>
            )}
          </RecentPropertiesList>
        </ActivitySection>
      </ContentGrid>

      <AdditionalStatsGrid>
        <StatsSection>
          <SectionTitle>Property Categories</SectionTitle>
          <CategoryStats>
            {getCategoryStats().map(category => (
              <CategoryItem key={category.name}>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>{category.count}</CategoryCount>
              </CategoryItem>
            ))}
          </CategoryStats>
        </StatsSection>

        <StatsSection>
          <SectionTitle>City Distribution</SectionTitle>
          <CityStats>
            {getCityStats().map(city => (
              <CityItem key={city.name}>
                <CityName>{city.name}</CityName>
                <CityCount>{city.count} properties</CityCount>
              </CityItem>
            ))}
          </CityStats>
        </StatsSection>
      </AdditionalStatsGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 0;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const ActionButton = styled.button`
  background: #cb54f8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #b13be0;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChartSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ActivitySection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const RecentPropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PropertyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const PropertyImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const PropertyName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const PropertyDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const PropertyLocation = styled.span`
  color: #666;
  font-size: 14px;
`;

const PropertyPrice = styled.span`
  color: #cb54f8;
  font-weight: 600;
  font-size: 14px;
`;

const PropertyStatus = styled.span`
  color: ${props => props.isAvailable ? '#28a745' : '#dc3545'};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
`;

const AdditionalStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatsSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CategoryStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const CategoryName = styled.span`
  color: #333;
  font-weight: 500;
`;

const CategoryCount = styled.span`
  color: #cb54f8;
  font-weight: 600;
  background: #cb54f820;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const CityStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const CityName = styled.span`
  color: #333;
  font-weight: 500;
`;

const CityCount = styled.span`
  color: #28a745;
  font-weight: 600;
  background: #28a74520;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

export default Dashboard;
