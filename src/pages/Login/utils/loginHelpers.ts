// ==========================================
// LOGIN HELPERS - PURE UTILITY FUNCTIONS
// ==========================================

import type { AuthUser, LoginCredentials, Result } from '../models';

// Create default login credentials
export const createDefaultLoginCredentials = (): LoginCredentials => ({
  email: '',
  password: '',
  rememberMe: false
});

// Sanitize login credentials
export const sanitizeLoginCredentials = (credentials: LoginCredentials): LoginCredentials => ({
  email: credentials.email?.trim().toLowerCase() || '',
  password: credentials.password || '',
  rememberMe: credentials.rememberMe || false
});

// Format user display name
export const formatUserDisplayName = (user: AuthUser): string => {
  const firstName = user.name?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return firstName || user.email || 'Usuario';
};

// Get user initials for avatar
export const getUserInitials = (user: AuthUser): string => {
  const firstName = user.name?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`;
  }

  if (firstInitial) {
    return firstInitial;
  }

  return user.email?.charAt(0).toUpperCase() || 'U';
};

// Check if user has specific privilege
export const userHasPrivilege = (user: AuthUser, privilege: string): boolean => {
  return user.privilege === privilege || user.privilege === 'admin';
};

// Check if user is active
export const isUserActive = (user: AuthUser): boolean => {
  return user.status === 'active' || user.status === 'activo';
};

// Create success result
export const createSuccessResult = <T>(data: T): Result<T> => ({
  success: true,
  data
});

// Create error result
export const createErrorResult = <T>(error: string): Result<T> => ({
  success: false,
  error
});

// Extract error message from various error types
export const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  // Para errores de tu backend (status 401, etc.)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Para errores de tu backend con estructura diferente
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Para errores estándar de axios
  if (error?.message) {
    return error.message;
  }

  // Para respuestas de error de tu backend
  if (error?.response?.statusText) {
    return error.response.statusText;
  }

  return 'Ha ocurrido un error inesperado';
};

// Generate session token (mock function)
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format last login date
export const formatLastLogin = (lastLogin?: string): string => {
  if (!lastLogin) return 'Nunca';

  const date = new Date(lastLogin);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Hoy';
  } else if (diffInDays === 1) {
    return 'Ayer';
  } else if (diffInDays < 30) {
    return `Hace ${diffInDays} días`;
  } else {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};