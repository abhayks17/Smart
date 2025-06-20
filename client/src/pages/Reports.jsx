import { useState } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaBolt, FaThermometerHalf, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';

const ReportsContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #1976d2;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 15px;
`;

const Select = styled.select`
  padding: 8px 12px;
  background-color: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#1976d2' : 'transparent'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#1565c0' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ReportCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ReportTitle = styled.h3`
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  svg {
    margin-right: 10px;
    color: ${props => props.iconColor || '#1976d2'};
  }
`;

const ReportValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 15px 0;
`;

const ReportChange = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.isPositive ? '#4caf50' : '#f44336'};
  font-size: 0.9rem;
`;

const DetailTable = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: 12px;
      color: rgba(255, 255, 255, 0.7);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    td {
      padding: 12px;
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const Reports = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  return (
    <ReportsContainer>
      <Header>
        <Title>
          <FaChartBar /> Reports
        </Title>
        
        <FilterControls>
          <Select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
          
          <Button>
            <FaCalendarAlt /> Custom Range
          </Button>
          
          <Button primary>
            Export Report
          </Button>
        </FilterControls>
      </Header>
      
      <ReportsGrid>
        {/* Energy Usage Card */}
        <ReportCard>
          <ReportTitle iconColor="#f44336">
            <FaBolt /> Energy Usage
          </ReportTitle>
          <ReportValue>213.7 kWh</ReportValue>
          <ReportChange isPositive={false}>↑ 8.2% from last {timeRange}</ReportChange>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '10px' }}>
            Peak usage: 6-8 PM daily
          </p>
        </ReportCard>
        
        {/* Temperature Card */}
        <ReportCard>
          <ReportTitle iconColor="#ff9800">
            <FaThermometerHalf /> Temperature
          </ReportTitle>
          <ReportValue>23.4°C</ReportValue>
          <ReportChange isPositive={true}>↓ 2.1% from last {timeRange}</ReportChange>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '10px' }}>
            Average: 22.8°C | Max: 26.2°C
          </p>
        </ReportCard>
        
        {/* Lighting Card */}
        <ReportCard>
          <ReportTitle iconColor="#ffd600">
            <FaLightbulb /> Lighting
          </ReportTitle>
          <ReportValue>34.2 kWh</ReportValue>
          <ReportChange isPositive={true}>↓ 5.7% from last {timeRange}</ReportChange>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '10px' }}>
            Most active: Living Room (12.8 kWh)
          </p>
        </ReportCard>
      </ReportsGrid>
      
      <DetailTable>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Daily Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Energy Usage</th>
              <th>Avg. Temperature</th>
              <th>Lighting</th>
              <th>Security Events</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>May 21, 2023</td>
              <td>32.4 kWh</td>
              <td>23.6°C</td>
              <td>5.2 kWh</td>
              <td>3</td>
            </tr>
            <tr>
              <td>May 20, 2023</td>
              <td>30.8 kWh</td>
              <td>22.9°C</td>
              <td>4.8 kWh</td>
              <td>0</td>
            </tr>
            <tr>
              <td>May 19, 2023</td>
              <td>33.1 kWh</td>
              <td>23.2°C</td>
              <td>5.4 kWh</td>
              <td>2</td>
            </tr>
            <tr>
              <td>May 18, 2023</td>
              <td>31.5 kWh</td>
              <td>23.8°C</td>
              <td>5.0 kWh</td>
              <td>1</td>
            </tr>
            <tr>
              <td>May 17, 2023</td>
              <td>29.2 kWh</td>
              <td>22.5°C</td>
              <td>4.7 kWh</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </DetailTable>
    </ReportsContainer>
  );
};

export default Reports; 