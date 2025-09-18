// ==========================================
// LOGIN HOOK
// ==========================================

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginResult } from '../models';
import { AuthServiceFactory } from '../services';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    user,
    isAuthenticated,
    handleSuccess,
    handleError,
    clearError,
    setIsLoading
  } = useAuth();

  // Login function
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResult> => {
    setIsLoading(true);
    clearError();

    try {
      // Crear use case sin callbacks para manejar la lógica directamente
      const loginUseCase = AuthServiceFactory.createLoginUseCase();

      const result = await loginUseCase.execute(email, password, rememberMe);

      if (result.isSuccess()) {
        const user = result.getUser();

        // Actualizar estado local
        handleSuccess(user);

        // Log para debug
        console.log('🚀 Login successful! User:', user.getDisplayName());
        console.log('📦 Token saved:', user.token.substring(0, 10) + '...');
        console.log('🔄 Navigating to dashboard...');

        // Navegar al dashboard (LoginUseCase ya guardó en localStorage)
        navigate('/dashboard');

        return result;
      } else {
        // Manejar error
        const errorMessage = result.getError();
        handleError(errorMessage);
        return result;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      handleError(errorMessage);
      return LoginResult.failure(errorMessage);
    }
  }, [navigate, handleSuccess, handleError, clearError, setIsLoading]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const loginUseCase = AuthServiceFactory.createLoginUseCase();
      await loginUseCase.logout();
      handleSuccess = (user) => {}; // Reset callback
      navigate('/login');
    } catch (error: any) {
      handleError(error.message);
    }
  }, [navigate, handleError]);

  return {
    // State
    isLoading,
    error,
    user,
    isAuthenticated,

    // Actions
    login,
    logout,
    clearError
  };
};