import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    return decoded.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem('token');

  if (!isTokenValid(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
  
  // MODIFICATION: Decode the token and check the user's role
  const { role } = jwtDecode(token);
  if (roles.length > 0 && !roles.includes(role)) {
    // If user's role is not permitted, redirect them.
    // A good default is a general dashboard or an 'unauthorized' page.
    return <Navigate to="/user" />; 
  }

  return children;
};

export default ProtectedRoute;