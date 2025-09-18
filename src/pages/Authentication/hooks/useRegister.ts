// ==========================================
// REGISTER HOOK
// ==========================================

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginResult } from '../models';
import { AuthServiceFactory } from '../services';
import { useAuth } from './useAuth';

export const useRegister = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    user,
    handleSuccess,
    handleError,
    clearError,
    setIsLoading
  } = useAuth();

  // Register function
  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<LoginResult> => {
    setIsLoading(true);
    clearError();

    try {
      const registerUseCase = AuthServiceFactory.createRegisterUseCase();
      const result = await registerUseCase.execute(name, email, password, confirmPassword);

      if (result.isSuccess()) {
        handleSuccess(result.getUser());
        navigate('/dashboard');
      } else {
        handleError(result.getError());
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      handleError(errorMessage);
      return LoginResult.failure(errorMessage);
    }
  }, [navigate, handleSuccess, handleError, clearError, setIsLoading]);

  return {
    // State
    isLoading,
    error,
    user,

    // Actions
    register,
    clearError
  };
};