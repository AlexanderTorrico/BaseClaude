// ==========================================
// AUTH INITIALIZER - CLEAN ARCHITECTURE
// ==========================================

import React, { useEffect } from 'react';
import { useUserAuth } from '../hooks/useUserAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { initializeAuth } = useUserAuth();

  useEffect(() => {
    // Initialize authentication state from storage on app startup
    const initAuth = async () => {
      try {
        const result = await initializeAuth();
        if (result && result.success) {
          console.log('✅ Authentication initialized successfully');
        } else {
          console.log('ℹ️ No stored authentication found');
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize authentication:', error);
      }
    };

    initAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};