// ==========================================
// AUTHENTICATION HOOKS
// ==========================================

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, LoginResult } from '../models';
import { AuthServiceFactory } from '../services';

// Main Authentication Hook
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize authentication state
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const loginUseCase = AuthServiceFactory.createLoginUseCase();
      const currentUser = await loginUseCase.getCurrentUser();
      const isAuth = await loginUseCase.isUserAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(isAuth);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Success callback
  const handleSuccess = useCallback((authenticatedUser: AuthUser) => {
    console.log("aqio 39");
    setUser(authenticatedUser);
    setError(null);
    setIsLoading(false);
    setIsAuthenticated(true);
  }, []);

  // Error callback
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setUser(null);
    setIsLoading(false);
    setIsAuthenticated(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    user,
    isAuthenticated,

    // Actions
    handleSuccess,
    handleError,
    clearError,
    checkAuthStatus,
    setIsLoading
  };
};