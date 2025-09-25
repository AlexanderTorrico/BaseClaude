// ==========================================
// LOGIN VALIDATION SCHEMAS - FUNCTIONAL APPROACH
// ==========================================

import { LoginFormErrors, ValidationResult, LoginCredentials } from './loginTypes';

// Validation rules interface
export interface LoginValidationSchema {
  email: {
    required: boolean;
    pattern: RegExp;
    minLength: number;
    maxLength: number;
  };
  password: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
}

// Default validation schema
export const defaultLoginValidationSchema: LoginValidationSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    maxLength: 100
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 50
  }
};

// Validation messages
export const loginValidationMessages = {
  email: {
    required: 'El email es obligatorio',
    invalid: 'Ingresa un email válido',
    minLength: 'El email debe tener al menos 5 caracteres',
    maxLength: 'El email no puede tener más de 100 caracteres'
  },
  password: {
    required: 'La contraseña es obligatoria',
    minLength: 'La contraseña debe tener al menos 6 caracteres',
    maxLength: 'La contraseña no puede tener más de 50 caracteres'
  },
  general: {
    invalidCredentials: 'Email o contraseña incorrectos',
    networkError: 'Error de conexión. Inténtalo de nuevo',
    serverError: 'Error del servidor. Inténtalo más tarde'
  }
} as const;