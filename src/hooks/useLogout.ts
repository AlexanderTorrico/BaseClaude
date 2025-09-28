// ==========================================
// GLOBAL LOGOUT HOOK
// ==========================================

import { useState } from 'react';
import { logoutService } from '../services/auth/logoutService';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const logout = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await logoutService();

      if (result.success) {
        // Redirect to login or reload page
        window.location.href = '/login';
      } else {
        setError(result.error || 'Error al cerrar sesión');
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    logout,
    isLoading,
    error,
    clearError
  };
};