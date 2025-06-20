import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaVideo, FaCog } from 'react-icons/fa';

const CustomizeHome = React.lazy(() => import('./CustomizeHome'));

const DashboardContainer = styled.div`
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  svg {
    margin-right: 10px;
    color: #1976d2;
  }
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  background-color: #232323;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  .status-dot {
    width: 8px;
    height: 8px;
    background-color: #4caf50;
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const UnifiedBoard = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 75vw;
  max-width: 100vw;
  margin: 0;
`;

const BoardHeader = styled.div`
  background-color: #232323;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabsContainer = styled.div`
  display: flex;
`;

const Tab = styled.div`
  padding: 8px 16px;
  margin-right: 5px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  background-color: ${props => props.active ? 'rgba(25, 118, 210, 0.2)' : 'transparent'};
  svg {
    margin-right: 8px;
    color: ${props => props.active ? '#1976d2' : 'rgba(255, 255, 255, 0.7)'};
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  svg {
    margin-right: 6px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const BoardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 10px;
  gap: 20px;
`;

const Section = styled.div`
  background-color: #232323;
  border-radius: 10px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  svg {
    margin-right: 10px;
    color: ${props => props.iconColor || '#1976d2'};
  }
`;

const SecurityCamera = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
  &:before {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #f44336;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.3);
    animation: blink 2s infinite;
  }
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
`;

const CameraLabel = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
`;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <DashboardContainer>
      <Header>
        <Title>
          <FaHome /> Smart Home Dashboard
        </Title>
        <Status>
          <div className="status-dot"></div>
          All systems online
        </Status>
      </Header>
      <UnifiedBoard>
        <BoardHeader>
          <TabsContainer>
            <Tab 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')}
            >
              <FaHome /> Home
            </Tab>
            <Tab 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
            >
              <FaVideo /> Security
            </Tab>
          </TabsContainer>
          <Controls>
            <ControlButton>
              <FaCog /> Settings
            </ControlButton>
          </Controls>
        </BoardHeader>
        <BoardContent>
          {activeTab === 'home' && (
            <>
              <Link to="/control" style={{ textDecoration: 'none' }}>
                <Section>
                  <SectionTitle iconColor="#1976d2">
                    <FaHome /> Control Smart Home
                  </SectionTitle>
                  <p>Go to smart home control panel to manage devices.</p>
                </Section>
              </Link>
              <Section>
                <SectionTitle iconColor="#1976d2">
                  <FaHome /> Customize Home Structure
                </SectionTitle>
                <Suspense fallback={<div>Loading...</div>}>
                  <CustomizeHome />
                </Suspense>
              </Section>
            </>
          )}
          {activeTab === 'security' && (
            <Section>
              <SectionTitle iconColor="#4caf50">
                <FaVideo /> Security Cameras
              </SectionTitle>
              <SecurityCamera>
                <CameraLabel>
                  <span>Front Door</span>
                  <span>Live</span>
                </CameraLabel>
              </SecurityCamera>
            </Section>
          )}
        </BoardContent>
      </UnifiedBoard>
    </DashboardContainer>
  );
};

export default Dashboard;
