// ==========================================
// STORAGE SERVICE - PURE FUNCTIONS
// ==========================================

import type { AuthUser, Result } from '../models';

// Storage keys
const STORAGE_KEYS = {
  AUTH_USER: 'authUser',
  AUTH_TOKEN: 'authToken',
  LAST_LOGIN: 'lastLogin'
} as const;

// Save user to storage
export const saveUserToStorage = (user: AuthUser): Result<boolean> => {
  try {
    const userData = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      privilege: user.privilege,
      phone: user.phone,
      logo: user.logo,
      language: user.language,
      status: user.status
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, user.token);
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());

    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save to storage' };
  }
};

// Get user from storage
export const getUserFromStorage = (): Result<AuthUser | null> => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (!userData || !token) {
      return { success: true, data: null };
    }

    const user = JSON.parse(userData);
    const authUser: AuthUser = {
      ...user,
      token,
      modules: [],
      roles: [],
      permissions: []
    };

    return { success: true, data: authUser };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load from storage' };
  }
};

// Get last login from storage
export const getLastLoginFromStorage = (): Result<string | null> => {
  try {
    const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    return { success: true, data: lastLogin };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load last login' };
  }
};

// Clear user from storage
export const clearUserFromStorage = (): Result<boolean> => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);

    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to clear storage' };
  }
};

// Check if user exists in storage
export const hasUserInStorage = (): Result<boolean> => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    return {
      success: true,
      data: !!(userData && token)
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to check storage' };
  }
};