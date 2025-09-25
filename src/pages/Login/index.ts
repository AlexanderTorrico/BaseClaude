// ==========================================
// LOGIN MODULE EXPORTS
// ==========================================

// Main page component
export { default as LoginPage } from './LoginPage';

// Components (if needed to be used elsewhere)
export { LoginForm } from './components/LoginForm';
export { EmailField } from './components/EmailField';
export { PasswordField } from './components/PasswordField';
export { RememberMeCheckbox } from './components/RememberMeCheckbox';
export { LoginButton } from './components/LoginButton';
export { LoginAlert } from './components/LoginAlert';
export { AuthInitializer } from './components/AuthInitializer';

// Hooks
export { useLoginForm } from './hooks/useLoginForm';
export { useUserAuth } from './hooks/useUserAuth';

// Use cases - Business Logic
export { loginUseCase } from './usecases/loginUseCase';
export { logoutUseCase } from './usecases/logoutUseCase';
export {
  loginWithStateUseCase,
  logoutWithStateUseCase,
  initializeUserFromStorageUseCase,
  updateUserProfileUseCase,
  resetUserStateUseCase
} from './usecases/userStateUseCase';

// Services - Infrastructure
export {
  saveUserToStorage,
  getUserFromStorage,
  getLastLoginFromStorage,
  clearUserFromStorage,
  hasUserInStorage
} from './services/storageService';

// Redux slice and actions - Presentation Layer
export {
  userReducer,
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  updateUserProfile,
  clearError,
  setLoading,
  initializeUser,
  resetUserState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectLastLogin,
  selectUserDisplayName,
  selectUserInitials,
  selectIsUserActive
} from './slices';

// Types
export type {
  LoginCredentials,
  AuthUser,
  LoginFormData,
  LoginResult,
  Result
} from './models';

// Utils
export {
  formatUserDisplayName,
  getUserInitials
} from './utils/loginHelpers';

export {
  validateLoginForm
} from './utils/loginValidators';