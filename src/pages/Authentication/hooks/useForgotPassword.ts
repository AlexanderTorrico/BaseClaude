// ==========================================
// FORGOT PASSWORD HOOK
// ==========================================

import { useState, useCallback } from 'react';
import { AuthServiceFactory } from '../services';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const forgotPasswordUseCase = AuthServiceFactory.createForgotPasswordUseCase();
      const result = await forgotPasswordUseCase.execute(email);

      if (result.success) {
        setSuccessMessage(result.message);
        setError(null);
      } else {
        setError(result.message);
        setSuccessMessage(null);
      }

      setIsLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      setError(errorMessage);
      setSuccessMessage(null);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    successMessage,

    // Actions
    forgotPassword,
    clearMessages
  };
};