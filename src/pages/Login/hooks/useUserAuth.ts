// ==========================================
// USE USER AUTH HOOK - CLEAN ARCHITECTURE
// ==========================================

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
} from '../slices';
import {
  loginWithStateUseCase,
  logoutWithStateUseCase,
  initializeUserFromStorageUseCase,
  updateUserProfileUseCase,
  resetUserStateUseCase
} from '../usecases/userStateUseCase';
import type { LoginCredentials, AuthUser } from '../models';

export const useUserAuth = () => {
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
      // Execute login with state management use case
      const loginWithState = loginWithStateUseCase();
      const result = await loginWithState(dispatch, credentials);

      if (result.success) {
        // Navigate to dashboard
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
      // Execute logout with state management use case
      const logoutWithState = logoutWithStateUseCase();
      const result = await logoutWithState(dispatch);

      // Always navigate to login (even if server logout fails)
      navigate('/login');

      return result;
    } catch (error: any) {
      // Navigate to login even on error
      navigate('/login');
      const errorMessage = error.message || 'Error al cerrar sesión';
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Initialize from storage (useful for app startup)
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

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const updateProfile = updateUserProfileUseCase();
      const result = await updateProfile(dispatch, updates, user);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      return { success: false, error: errorMessage };
    }
  }, [dispatch, user]);

  // Reset user state
  const resetAuth = useCallback(async () => {
    try {
      const resetState = resetUserStateUseCase();
      const result = await resetState(dispatch);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al resetear estado';
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
    updateProfile,
    resetAuth,
    clearAuthError,
    initializeAuth,

    // Utilities
    hasPrivilege,
    isUserActive
  };
};