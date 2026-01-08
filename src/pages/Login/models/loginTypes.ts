// ==========================================
// LOGIN TYPES - FUNCTIONAL APPROACH
// ==========================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormData extends LoginCredentials {
  errors: LoginFormErrors;
  isSubmitting: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginResult {
  success: boolean;
  data?: AuthUser;
  error?: string;
  message?: string;
}

export interface AuthUser {
  id: string;  // Este ahora es el uuid para retrocompatibilidad
  uuid?: string;  // UUID explícito del usuario
  name: string;
  lastName: string;
  email: string;
  token: string;
  privilege: string;
  phone?: string;
  logo?: string;
  language?: string;
  status: string;
  modules?: any[];
  roles?: any[];
  permissions?: any[];
}

export interface LoginState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  lastLogin?: string;
}

export interface SocialLoginProvider {
  provider: 'google' | 'facebook' | 'github';
  clientId: string;
  redirectUri: string;
}

// Result pattern for functional error handling
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: LoginFormErrors;
}