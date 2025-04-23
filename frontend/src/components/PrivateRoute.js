import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user"); // or use a context/store

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;