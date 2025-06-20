import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute; 