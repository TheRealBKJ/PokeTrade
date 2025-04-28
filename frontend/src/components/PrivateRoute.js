import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');

  return accessToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
