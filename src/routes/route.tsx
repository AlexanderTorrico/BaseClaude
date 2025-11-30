import React from "react";
import { Navigate } from "react-router-dom";

interface AuthmiddlewareProps {
  children: React.ReactNode;
}

const Authmiddleware: React.FC<AuthmiddlewareProps> = ({ children }) => {
  const isFakeAuth = import.meta.env.VITE_APP_DEFAULTAUTH === 'fake';

  if (!localStorage.getItem("authUser") && !isFakeAuth) {
    return <Navigate to="/login" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default Authmiddleware;
