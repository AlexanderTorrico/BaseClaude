// ==========================================
// USER STATE USE CASE - CLEAN ARCHITECTURE
// ==========================================

import { Dispatch } from '@reduxjs/toolkit';
import type { AuthUser, Result } from '../models';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserProfile,
  initializeUser,
  resetUserState
} from '../slices';
import {
  saveUserToStorage,
  getUserFromStorage,
  getLastLoginFromStorage,
  clearUserFromStorage
} from '../services/storageService';
import { loginUseCase } from './loginUseCase';

// Login with state management use case
export const loginWithStateUseCase = () => {
  return async (
    dispatch: Dispatch,
    credentials: { email: string; password: string; rememberMe?: boolean }
  ): Promise<Result<AuthUser>> => {
    // Start loading
    dispatch(loginStart());

    try {
      // Execute login business logic
      const loginWithDependencies = loginUseCase();
      const result = await loginWithDependencies(credentials);

      if (result.success && result.data) {
        // Save to storage
        const storageResult = await saveUserToStorage(result.data);

        if (!storageResult.success) {
          }

        // Update Redux state
        dispatch(loginSuccess(result.data));

        return { success: true, data: result.data };
      } else {
        // Handle login failure
        dispatch(loginFailure(result.error || 'Login failed'));
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unexpected error during login';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};


// Initialize user from storage use case
export const initializeUserFromStorageUseCase = () => {
  return async (dispatch: Dispatch): Promise<Result<boolean>> => {
    try {
      // Get user from storage
      const userResult = await getUserFromStorage();
      const lastLoginResult = await getLastLoginFromStorage();

      if (userResult.success) {
        dispatch(initializeUser({
          user: userResult.data,
          lastLogin: lastLoginResult.success ? lastLoginResult.data || undefined : undefined
        }));

        return { success: true, data: true };
      } else {
        // Initialize with empty state
        dispatch(initializeUser({ user: null }));
        return { success: false, error: userResult.error || 'Failed to load user from storage' };
      }
    } catch (error: any) {
      // Initialize with empty state
      dispatch(initializeUser({ user: null }));
      return { success: false, error: error.message || 'Failed to initialize user' };
    }
  };
};

// Update user profile with persistence use case
export const updateUserProfileUseCase = () => {
  return async (
    dispatch: Dispatch,
    updates: Partial<AuthUser>,
    currentUser: AuthUser
  ): Promise<Result<AuthUser>> => {
    try {
      // Update Redux state
      dispatch(updateUserProfile(updates));

      // Create updated user object
      const updatedUser = { ...currentUser, ...updates };

      // Save to storage
      const storageResult = await saveUserToStorage(updatedUser);

      if (!storageResult.success) {
        return { success: false, error: storageResult.error || 'Failed to save profile updates' };
      }

      return { success: true, data: updatedUser };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };
};

// Reset user state with storage cleanup use case
export const resetUserStateUseCase = () => {
  return async (dispatch: Dispatch): Promise<Result<boolean>> => {
    try {
      // Clear storage
      const storageResult = await clearUserFromStorage();

      if (!storageResult.success) {
      }

      // Reset Redux state
      dispatch(resetUserState());

      return { success: true, data: true };
    } catch (error: any) {
      // Reset state even if storage clear fails
      dispatch(resetUserState());
      return { success: false, error: error.message || 'Failed to reset user state' };
    }
  };
};