import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const RegisterContainer = styled.div`
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
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
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

const Register = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
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
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <Header>
        <Logo>💠 Smart Home</Logo>
        <Title>Create an Account</Title>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        {error && <Error>{error}</Error>}
        
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </FormGroup>
        
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
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            type="password" 
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      
      <LinkText>
        Already have an account? <Link to="/login">Login</Link>
      </LinkText>
    </RegisterContainer>
  );
};

export default Register; 