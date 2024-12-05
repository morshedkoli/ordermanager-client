import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access user from context

  // If user is not found (not logged in), redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; // If user exists, render the protected component (Dashboard, etc.)
};

export default ProtectedRoute;
