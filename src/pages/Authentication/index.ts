// ==========================================
// AUTHENTICATION MODULE EXPORTS
// Centralized access to all authentication functionality
// ==========================================

// ✅ Domain Models & Interfaces
export * from './models';

// ✅ Custom Hooks
export * from './hooks';

// ✅ Redux Slices
export * from './slices';

// ✅ Use Cases (Business Logic)
export * from './usecases';

// ✅ Adapters (External API Integration)
export * from './adapters';

// ✅ Services (Factories & Dependencies)
export * from './services';

// ✅ React Components (Re-export existing ones)
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as ForgetPassword } from './ForgetPassword';
export { default as Logout } from './Logout';
export { default as UserProfile } from './user-profile';

// ==========================================
// QUICK ACCESS UTILITIES
// ==========================================

import { AuthServiceFactory, AuthHttpService } from './services';

// Quick access functions for common operations
export const AuthUtils = {
  // Check if user is authenticated
  isAuthenticated: () => AuthServiceFactory.isAuthenticated(),

  // Get current user
  getCurrentUser: () => AuthServiceFactory.getCurrentUser(),

  // Logout current user
  logout: () => AuthServiceFactory.logout(),

  // Create login use case
  createLoginUseCase: (onSuccess?: any, onError?: any) =>
    AuthServiceFactory.createLoginUseCase(onSuccess, onError),

  // Create register use case
  createRegisterUseCase: () => AuthServiceFactory.createRegisterUseCase(),

  // Create forgot password use case
  createForgotPasswordUseCase: () => AuthServiceFactory.createForgotPasswordUseCase(),

  // Create profile use case
  createProfileUseCase: () => AuthServiceFactory.createProfileUseCase(),

  // Direct HTTP service access (for advanced usage)
  createHttpService: (config?: any) => new AuthHttpService(config),
};