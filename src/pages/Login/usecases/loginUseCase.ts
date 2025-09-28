// ==========================================
// LOGIN USE CASE - FUNCTIONAL APPROACH
// ==========================================

import type { LoginCredentials, AuthUser, Result } from '../models';
import { validateLoginForm } from '../utils/loginValidators';
import { sanitizeLoginCredentials } from '../utils/loginHelpers';
import {
  loginFromApi,
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage,
  logoutFromApi
} from '../adapters/loginApiAdapter';

// Dependencies interface for dependency injection
interface LoginUseCaseDependencies {
  loginFromApi: typeof loginFromApi;
  saveUserToStorage: typeof saveUserToStorage;
  getUserFromStorage: typeof getUserFromStorage;
  clearUserFromStorage: typeof clearUserFromStorage;
  logoutFromApi: typeof logoutFromApi;
}

// Default dependencies
const defaultDependencies: LoginUseCaseDependencies = {
  loginFromApi,
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage,
  logoutFromApi
};

// Login use case function
export const loginUseCase = (
  dependencies: LoginUseCaseDependencies = defaultDependencies
) => async (credentials: LoginCredentials): Promise<Result<AuthUser>> => {
  try {
    // 1. Validate input
    const validation = validateLoginForm(credentials);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0] || 'Datos inválidos';
      return {
        success: false,
        error: errorMessage
      };
    }

    // 2. Sanitize credentials
    const sanitizedCredentials = sanitizeLoginCredentials(credentials);

    // 3. Attempt login via API
    const loginResult = await dependencies.loginFromApi(sanitizedCredentials);

    if (!loginResult.success) {
      return loginResult;
    }

    // 4. Save user session
    dependencies.saveUserToStorage(loginResult.data);

    // 5. Return successful result
    return {
      success: true,
      data: loginResult.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Login failed unexpectedly'
    };
  }
};

// Logout use case function
export const logoutUseCase = (
  dependencies: LoginUseCaseDependencies = defaultDependencies
) => async (): Promise<Result<boolean>> => {
  try {
    // 1. Clear local storage first
    dependencies.clearUserFromStorage();

    // 2. Attempt API logout (non-blocking)
    await dependencies.logoutFromApi();

    return {
      success: true,
      data: true
    };
  } catch (error: any) {
    // Even if API logout fails, local logout is successful
    return {
      success: true,
      data: true
    };
  }
};

// Get current user use case function
export const getCurrentUserUseCase = (
  dependencies: LoginUseCaseDependencies = defaultDependencies
) => (): AuthUser | null => {
  return dependencies.getUserFromStorage();
};

// Check authentication status use case function
export const checkAuthStatusUseCase = (
  dependencies: LoginUseCaseDependencies = defaultDependencies
) => (): boolean => {
  const user = dependencies.getUserFromStorage();
  return user !== null && !!user.token;
};

// Remember me use case function
export const rememberMeUseCase = (
  dependencies: LoginUseCaseDependencies = defaultDependencies
) => (user: AuthUser, remember: boolean): void => {
  if (remember) {
    // Save to localStorage (persistent)
    dependencies.saveUserToStorage(user);
  } else {
    // Clear persistent storage and save to sessionStorage
    dependencies.clearUserFromStorage();
    try {
      sessionStorage.setItem('authUser', JSON.stringify({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        privilege: user.privilege,
        phone: user.phone,
        logo: user.logo,
        language: user.language,
        status: user.status
      }));
      sessionStorage.setItem('authToken', user.token);
    } catch (error) {
    }
  }
};