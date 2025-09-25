// ==========================================
// REGISTER MODULE EXPORTS
// ==========================================

// Main Page Component (used by routes)
export { default as RegisterPage } from './RegisterPage';

// Redux Slice and Actions (used by store and components)
export { default as registerReducer } from './slices/registerSlice';
export {
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegisterError,
  clearRegistration,
  resetRegisterState,
  selectIsRegistered,
  selectRegisteredUser,
  selectRegisterLoading,
  selectRegisterError,
  selectRegistrationDate,
} from './slices/registerSlice';

// Hooks (used by components)
export { useRegisterAuth } from './hooks/useRegisterAuth';

// Services (used by use cases)
export { registerApiService } from './services/registerApiService';
export { registerApiAdapter } from './services/registerApiAdapter';
export {
  saveRegisteredUserToStorage,
  getRegisteredUserFromStorage,
  clearRegisteredUserFromStorage,
} from './services/storageService';

// Use Cases (used by hooks)
export { registerUseCase } from './usecases/registerUseCase';
export { registerWithStateUseCase } from './usecases/registerStateUseCase';

// Utilities (used by components and use cases)
export {
  registerValidationSchema,
  validateRegisterForm,
  sanitizeRegisterInput,
} from './utils/registerValidators';

// Types (used by all files)
export type {
  RegisterCredentials,
  RegisterFormData,
  RegisterResponse,
  RegisterState,
  Result,
} from './types/registerTypes';