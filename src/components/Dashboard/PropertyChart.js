import React from 'react';
import styled from 'styled-components';

const PropertyChart = () => {
  const chartData = [
    { month: 'Jan', occupied: 85, vacant: 15 },
    { month: 'Feb', occupied: 88, vacant: 12 },
    { month: 'Mar', occupied: 92, vacant: 8 },
    { month: 'Apr', occupied: 89, vacant: 11 },
    { month: 'May', occupied: 94, vacant: 6 },
    { month: 'Jun', occupied: 91, vacant: 9 }
  ];

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Occupancy Rate (Last 6 Months)</ChartTitle>
        <Legend>
          <LegendItem>
            <LegendColor color="#cb54f8" />
            <span>Occupied</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#e9ecef" />
            <span>Vacant</span>
          </LegendItem>
        </Legend>
      </ChartHeader>
      
      <Chart>
        {chartData.map((data, index) => (
          <ChartBar key={index}>
            <BarContainer>
              <OccupiedBar height={data.occupied} />
              <VacantBar height={data.vacant} />
            </BarContainer>
            <BarLabel>{data.month}</BarLabel>
            <BarValue>{data.occupied}%</BarValue>
          </ChartBar>
        ))}
      </Chart>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const Chart = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  padding: 20px 0;
  border-bottom: 2px solid #e9ecef;
  position: relative;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ChartBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 60px;
`;

const BarContainer = styled.div`
  width: 30px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  background-color: #e9ecef;

  @media (max-width: 768px) {
    height: 100px;
    width: 25px;
  }
`;

const OccupiedBar = styled.div`
  width: 100%;
  background-color: #cb54f8;
  height: ${props => props.height}%;
  transition: height 0.3s ease;
`;

const VacantBar = styled.div`
  width: 100%;
  background-color: #e9ecef;
  height: ${props => props.height}%;
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
`;

const BarValue = styled.div`
  font-size: 11px;
  color: #cb54f8;
  font-weight: 600;
  margin-top: 2px;
`;

export default PropertyChart;
