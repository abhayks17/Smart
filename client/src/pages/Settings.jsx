import { useState } from 'react';
import styled from 'styled-components';
import { FaCog, FaBell, FaLock, FaUserCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
`;

const SettingsNav = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &.active {
    background-color: rgba(25, 118, 210, 0.2);
  }
  
  svg {
    margin-right: 10px;
    color: #1976d2;
  }
`;

const SettingsContent = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
`;

const SettingsSection = styled.div`
  margin-bottom: 30px;
  
  h2 {
    font-size: 1.4rem;
    margin-bottom: 20px;
    color: white;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  color: white;
  
  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.active ? '#1976d2' : 'rgba(255, 255, 255, 0.4)'};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const Button = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  
  return (
    <SettingsContainer>
      <Header>
        <Title>
          <FaCog /> Settings
        </Title>
      </Header>
      
      <SettingsGrid>
        <SettingsNav>
          <NavItem 
            className={activeSection === 'account' ? 'active' : ''} 
            onClick={() => setActiveSection('account')}
          >
            <FaUserCircle /> Account
          </NavItem>
          <NavItem 
            className={activeSection === 'notifications' ? 'active' : ''} 
            onClick={() => setActiveSection('notifications')}
          >
            <FaBell /> Notifications
          </NavItem>
          <NavItem 
            className={activeSection === 'security' ? 'active' : ''} 
            onClick={() => setActiveSection('security')}
          >
            <FaLock /> Security
          </NavItem>
        </SettingsNav>
        
        <SettingsContent>
          {activeSection === 'account' && (
            <SettingsSection>
              <h2>Account Settings</h2>
              
              <FormGroup>
                <Label>Name</Label>
                <Input type="text"  />
              </FormGroup>
              
              <FormGroup>
                <Label>Email</Label>
                <Input type="email"  />
              </FormGroup>
              
              <SettingItem>
                <SettingLabel>
                  Dark Mode
                  <p>Use dark theme for the application</p>
                </SettingLabel>
                <ToggleButton 
                  active={darkModeEnabled}
                  onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                >
                  {darkModeEnabled ? <FaToggleOn /> : <FaToggleOff />}
                </ToggleButton>
              </SettingItem>
              
              <Button>Save Changes</Button>
            </SettingsSection>
          )}
          
          {activeSection === 'notifications' && (
            <SettingsSection>
              <h2>Notification Settings</h2>
              
              <SettingItem>
                <SettingLabel>
                  Enable Notifications
                  <p>Receive alerts for important events</p>
                </SettingLabel>
                <ToggleButton 
                  active={notificationsEnabled}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? <FaToggleOn /> : <FaToggleOff />}
                </ToggleButton>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  Motion Alerts
                  <p>Get notifications when motion is detected</p>
                </SettingLabel>
                <ToggleButton active={true}>
                  <FaToggleOn />
                </ToggleButton>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  Energy Reports
                  <p>Receive weekly energy usage reports</p>
                </SettingLabel>
                <ToggleButton active={true}>
                  <FaToggleOn />
                </ToggleButton>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  System Updates
                  <p>Get notified about system updates</p>
                </SettingLabel>
                <ToggleButton active={false}>
                  <FaToggleOff />
                </ToggleButton>
              </SettingItem>
            </SettingsSection>
          )}
          
          {activeSection === 'security' && (
            <SettingsSection>
              <h2>Security Settings</h2>
              
              <FormGroup>
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </FormGroup>
              
              <FormGroup>
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </FormGroup>
              
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </FormGroup>
              
              <SettingItem>
                <SettingLabel>
                  Auto-Lock
                  <p>Automatically lock your home when you leave</p>
                </SettingLabel>
                <ToggleButton 
                  active={autoLockEnabled}
                  onClick={() => setAutoLockEnabled(!autoLockEnabled)}
                >
                  {autoLockEnabled ? <FaToggleOn /> : <FaToggleOff />}
                </ToggleButton>
              </SettingItem>
              
              <Button>Update Password</Button>
            </SettingsSection>
          )}
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings; 