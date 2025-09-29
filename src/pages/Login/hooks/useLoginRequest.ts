import { useState } from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';
import { sanitizeLoginCredentials } from '../utils/loginHelpers';
import type { LoginCredentials } from '../models';

interface LoginResult {
  success: boolean;
  error?: string;
}

export const useLoginRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  // Clear error state
  const clearError = () => {
    setError('');
  };

  // Prepare credentials for login
  const prepareCredentials = (rawCredentials: LoginCredentials) => {
    return sanitizeLoginCredentials(rawCredentials);
  };

  // Execute login request
  const executeLogin = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      setError('');

      // Prepare credentials
      const sanitizedCredentials = prepareCredentials(credentials);

      // Execute login
      const result = await login(sanitizedCredentials);

      if (result.success) {
        return { success: true };
      } else {
        const errorMsg = result.error || 'Error al iniciar sesión';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // States
    isLoading,
    error,

    // Actions
    executeLogin,
    clearError
  };
};