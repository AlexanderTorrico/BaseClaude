// ==========================================
// AUTHENTICATION MODULE EXPORTS
// ==========================================

// Redux Slice (used by store)
export { default as authReducer } from './slices/authSlice';

// Service Factory (used by App.tsx)
export { AuthServiceFactory } from './services/AuthServiceFactory';

// React Components (used by routes)
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as ForgetPassword } from './ForgetPassword';
export { default as Logout } from './Logout';
export { default as UserProfile } from './user-profile';