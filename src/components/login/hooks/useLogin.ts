import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginServiceFactory } from '@/services/login';
import { AuthUser, LoginResult } from '@/models/login';

// Custom Hook - Clean Architecture Integration
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  // Success callback - follows Single Responsibility Principle
  const handleLoginSuccess = useCallback((authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setError(null);
    setIsLoading(false);
    navigate('/dashboard');
  }, [navigate]);

  // Error callback
  const handleLoginError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Create login use case with callbacks
  const loginUseCase = LoginServiceFactory.createLoginUseCase(
    handleLoginSuccess,
    handleLoginError
  );

  // Login function - Interface Segregation Principle
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(email, password, rememberMe);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      handleLoginError(errorMessage);
      return LoginResult.failure(errorMessage);
    }
  }, [loginUseCase, handleLoginError]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await loginUseCase.logout();
      setUser(null);
      setError(null);
      navigate('/login');
    } catch (error: any) {
      setError(error.message);
    }
  }, [loginUseCase, navigate]);

  // Get current user
  const getCurrentUser = useCallback(async (): Promise<AuthUser | null> => {
    return await loginUseCase.getCurrentUser();
  }, [loginUseCase]);

  // Check authentication status
  const checkAuth = useCallback(async (): Promise<boolean> => {
    return await loginUseCase.isUserAuthenticated();
  }, [loginUseCase]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    user,

    // Actions
    login,
    logout,
    getCurrentUser,
    checkAuth,
    clearError
  };
};