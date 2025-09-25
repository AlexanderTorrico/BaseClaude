// ==========================================
// AUTHENTICATION MODULE EXPORTS
// ==========================================

// Redux Slice and Actions (used by store and components)
export { default as authReducer } from './slices/authSlice';
export {
  loginUser,
  registerUser,
  forgotPassword,
  logoutUser,
  socialLogin,
  updateProfile,
  apiError,
  clearError,
  clearMessages,
  setAuthenticated,
  setUser
} from './slices/authSlice';

// Service Factory (used by App.tsx)
export { AuthServiceFactory } from './services/AuthServiceFactory';

// React Components (used by routes)
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as ForgetPassword } from './ForgetPassword';
export { default as Logout } from './Logout';
export { default as UserProfile } from './user-profile';