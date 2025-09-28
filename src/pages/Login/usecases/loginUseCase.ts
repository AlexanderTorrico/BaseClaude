// ==========================================
// LOGIN USE CASE - FUNCTIONAL APPROACH
// ==========================================

import type { LoginCredentials, AuthUser, Result } from '../models';
import { validateLoginForm } from '../utils/loginValidators';
import { sanitizeLoginCredentials } from '../utils/loginHelpers';
import {
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage
} from '../adapters/loginApiAdapter';
import { loginService } from '../services/loginHttpService';

// Dependencies interface for dependency injection
interface LoginUseCaseDependencies {
  loginService: typeof loginService;
  saveUserToStorage: typeof saveUserToStorage;
  getUserFromStorage: typeof getUserFromStorage;
  clearUserFromStorage: typeof clearUserFromStorage;
}

// Default dependencies
const defaultDependencies: LoginUseCaseDependencies = {
  loginService,
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage
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
    const loginResult = await dependencies.loginService(sanitizedCredentials);

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