import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);

  if (authenticated === null) {
    // Optionally, show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/stocks/home" />;
};

export default ProtectedRoute;
