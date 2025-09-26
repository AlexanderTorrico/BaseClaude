import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserDisplayName,
  selectUserInitials,
  clearError
} from '../../pages/Login/slices';
import {
  loginWithStateUseCase,
  logoutWithStateUseCase,
  initializeUserFromStorageUseCase
} from '../../pages/Login/usecases/userStateUseCase';
import type { LoginCredentials, AuthUser } from '../../pages/Login/models';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const userDisplayName = useSelector(selectUserDisplayName);
  const userInitials = useSelector(selectUserInitials);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const loginWithState = loginWithStateUseCase();
      const result = await loginWithState(dispatch, credentials);

      if (result.success) {
        navigate('/dashboard');
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const logoutWithState = logoutWithStateUseCase();
      const result = await logoutWithState(dispatch);

      navigate('/login');
      return result;
    } catch (error: any) {
      navigate('/login');
      const errorMessage = error.message || 'Error al cerrar sesión';
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Initialize from storage
  const initializeAuth = useCallback(async () => {
    try {
      const initializeFromStorage = initializeUserFromStorageUseCase();
      const result = await initializeFromStorage(dispatch);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al inicializar autenticación';
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Check if user has specific privilege
  const hasPrivilege = useCallback((privilege: string): boolean => {
    if (!user) return false;
    return user.privilege === privilege || user.privilege === 'admin';
  }, [user]);

  // Check if user is active
  const isUserActive = useCallback((): boolean => {
    if (!user) return false;
    return user.status === 'active' || user.status === 'activo';
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userDisplayName,
    userInitials,

    // Actions
    login,
    logout,
    clearAuthError,
    initializeAuth,

    // Utilities
    hasPrivilege,
    isUserActive
  };
};