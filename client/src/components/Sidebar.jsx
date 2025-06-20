import { NavLink } from 'react-router-dom';
import { FaHome, FaCog, FaPlug,FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import styled from 'styled-components';

const StyledSidebar = styled.div`
  width: 220px;
  height: 240vh;
  background-color: #141414;
  color: white;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 0 20px;
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  &.active {
    background-color: rgba(25, 118, 210, 0.2);
    color: #1976d2;
    border-left: 4px solid #1976d2;
  }
  
  svg {
    margin-right: 10px;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 10px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff5252;
    border-color: rgba(255, 82, 82, 0.3);
  }
  
  svg {
    margin-right: 8px;
  }
`;

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <StyledSidebar>
      <Logo>
        <span>💠 Smart Home</span>
      </Logo>
      
      <NavMenu>
        <StyledNavLink to="/" end>
          <FaHome size={20} /> Dashboard
        </StyledNavLink>
        
        <StyledNavLink to="/Devices">
          <FaPlug size={20} /> Devices
        </StyledNavLink>
        <StyledNavLink to="/settings">
          <FaCog size={20} /> Settings
        </StyledNavLink>
        <StyledNavLink to="/reports">
          <FaChartBar size={20} /> Reports
        </StyledNavLink>
      </NavMenu>
      
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt size={18} /> Logout
      </LogoutButton>
      
      <Footer>
        © 2023 SmartHome Inc.
      </Footer>
    </StyledSidebar>
  );
};

export default Sidebar; 