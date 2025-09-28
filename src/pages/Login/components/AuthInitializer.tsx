// ==========================================
// AUTH INITIALIZER - CLEAN ARCHITECTURE
// ==========================================

import React, { useEffect } from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize authentication state from storage on app startup
    const initAuth = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        // Silent fail - initialization errors are not critical
      }
    };

    initAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};