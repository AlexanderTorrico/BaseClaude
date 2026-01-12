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
 * Se usa fuera del schema de Yup porque la validación de archivos
 * requiere acceso al objeto File que FormData maneja de forma diferente.
 *
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
