import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  background-color: #2a2a2a;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  color: white;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1565c0;
  }
  
  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #f44336;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  a {
    color: #1976d2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoLogin = styled.div`
  margin-top: 20px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  text-align: center;
`;

const DemoButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 0.9rem;
  
  &:hover {
    color: #1565c0;
  }
`;

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, allow a special demo login
      if (email === 'demo@smarthome.com' && password === 'demo123') {
        // Simulate successful login
        localStorage.setItem('token', 'demo-token-12345');
        setIsLoggedIn(true);
        navigate('/');
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Update auth state
      setIsLoggedIn(true);
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const useDefaultLogin = () => {
    setEmail('demo@smarthome.com');
    setPassword('demo123');
  };
  
  return (
    <LoginContainer>
      <Header>
        <Logo>💠 Smart Home</Logo>
        <Title>Log In</Title>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        {error && <Error>{error}</Error>}
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        
        <DemoLogin>
          <div>No account? Use our demo credentials</div>
          <DemoButton type="button" onClick={useDefaultLogin}>
            Auto-fill Demo Login
          </DemoButton>
        </DemoLogin>
      </Form>
      
      <LinkText>
        Don't have an account? <Link to="/register">Register</Link>
      </LinkText>
    </LoginContainer>
  );
};

export default Login; 