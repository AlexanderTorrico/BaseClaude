// ==========================================
// LOGIN VALIDATORS - PURE FUNCTIONS
// ==========================================

import type {
  LoginCredentials,
  LoginFormErrors,
  ValidationResult,
  LoginValidationSchema
} from '../models';
import {
  defaultLoginValidationSchema,
  loginValidationMessages
} from '../models/loginValidation';

// Validate email field
export const validateEmail = (email: string): string | undefined => {
  const rules = defaultLoginValidationSchema.email;
  const messages = loginValidationMessages.email;

  if (rules.required && !email.trim()) {
    return messages.required;
  }

  if (email.length < rules.minLength) {
    return messages.minLength;
  }

  if (email.length > rules.maxLength) {
    return messages.maxLength;
  }

  if (!rules.pattern.test(email)) {
    return messages.invalid;
  }

  return undefined;
};

// Validate password field
export const validatePassword = (password: string): string | undefined => {
  const rules = defaultLoginValidationSchema.password;
  const messages = loginValidationMessages.password;

  if (rules.required && !password) {
    return messages.required;
  }

  if (password.length < rules.minLength) {
    return messages.minLength;
  }

  if (password.length > rules.maxLength) {
    return messages.maxLength;
  }

  return undefined;
};

// Validate complete login form
export const validateLoginForm = (credentials: LoginCredentials): ValidationResult => {
  const errors: LoginFormErrors = {};

  // Validate email
  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate password
  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate field by name (for real-time validation)
export const validateField = (
  fieldName: keyof LoginCredentials,
  value: string
): string | undefined => {
  switch (fieldName) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    default:
      return undefined;
  }
};

// Check if credentials are complete (all required fields filled)
export const areCredentialsComplete = (credentials: LoginCredentials): boolean => {
  return !!(
    credentials.email?.trim() &&
    credentials.password?.trim()
  );
};