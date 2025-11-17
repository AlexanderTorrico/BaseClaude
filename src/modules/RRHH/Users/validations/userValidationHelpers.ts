import { UserValidationRules } from './userValidationRules';

/**
 * Resultado de validación
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Helper para validar avatar
 * @param file - Archivo a validar (puede ser null si es opcional)
 * @returns Resultado de validación con estado y mensaje de error si aplica
 */
export const validateAvatar = (file: File | null): ValidationResult => {
  if (!file) {
    return { valid: true }; // Avatar es opcional
  }

  // Validar tamaño
  if (file.size > UserValidationRules.avatar.maxSize) {
    return {
      valid: false,
      error: UserValidationRules.avatar.messages.maxSize
    };
  }

  // Validar formato
  if (!UserValidationRules.avatar.acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: UserValidationRules.avatar.messages.invalidFormat
    };
  }

  return { valid: true };
};

/**
 * Helper para validar nombre
 * @param name - Nombre a validar
 * @returns Resultado de validación
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      valid: false,
      error: UserValidationRules.name.messages.required
    };
  }

  if (name.length < UserValidationRules.name.minLength) {
    return {
      valid: false,
      error: UserValidationRules.name.messages.minLength
    };
  }

  if (name.length > UserValidationRules.name.maxLength) {
    return {
      valid: false,
      error: UserValidationRules.name.messages.maxLength
    };
  }

  if (!UserValidationRules.name.pattern.test(name)) {
    return {
      valid: false,
      error: UserValidationRules.name.messages.pattern
    };
  }

  return { valid: true };
};

/**
 * Helper para validar apellido
 * @param lastName - Apellido a validar
 * @returns Resultado de validación
 */
export const validateLastName = (lastName: string): ValidationResult => {
  if (!lastName || lastName.trim() === '') {
    return {
      valid: false,
      error: UserValidationRules.lastName.messages.required
    };
  }

  if (lastName.length < UserValidationRules.lastName.minLength) {
    return {
      valid: false,
      error: UserValidationRules.lastName.messages.minLength
    };
  }

  if (lastName.length > UserValidationRules.lastName.maxLength) {
    return {
      valid: false,
      error: UserValidationRules.lastName.messages.maxLength
    };
  }

  if (!UserValidationRules.lastName.pattern.test(lastName)) {
    return {
      valid: false,
      error: UserValidationRules.lastName.messages.pattern
    };
  }

  return { valid: true };
};

/**
 * Helper para validar email
 * @param email - Email a validar
 * @returns Resultado de validación
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      valid: false,
      error: UserValidationRules.email.messages.required
    };
  }

  if (!UserValidationRules.email.pattern.test(email)) {
    return {
      valid: false,
      error: UserValidationRules.email.messages.invalid
    };
  }

  return { valid: true };
};

/**
 * Helper para validar teléfono
 * @param phone - Teléfono a validar
 * @returns Resultado de validación
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return {
      valid: false,
      error: UserValidationRules.phone.messages.required
    };
  }

  if (phone.length < UserValidationRules.phone.minLength) {
    return {
      valid: false,
      error: UserValidationRules.phone.messages.minLength
    };
  }

  if (phone.length > UserValidationRules.phone.maxLength) {
    return {
      valid: false,
      error: UserValidationRules.phone.messages.maxLength
    };
  }

  if (!UserValidationRules.phone.pattern.test(phone)) {
    return {
      valid: false,
      error: UserValidationRules.phone.messages.pattern
    };
  }

  return { valid: true };
};

/**
 * Helper para validar contraseña
 * @param password - Contraseña a validar
 * @returns Resultado de validación
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return {
      valid: false,
      error: UserValidationRules.password.messages.required
    };
  }

  if (password.length < UserValidationRules.password.minLength) {
    return {
      valid: false,
      error: UserValidationRules.password.messages.minLength
    };
  }

  if (password.length > UserValidationRules.password.maxLength) {
    return {
      valid: false,
      error: UserValidationRules.password.messages.maxLength
    };
  }

  // Validar fortaleza
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      valid: false,
      error: UserValidationRules.password.messages.weak
    };
  }

  return { valid: true };
};
