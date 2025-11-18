import { CompanyValidationRules, BranchValidationRules } from './companyValidationRules';

/**
 * Resultado de validación
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida el logo de la compañía
 */
export const validateLogo = (file: File | null): ValidationResult => {
  if (!file) return { valid: true };

  if (file.size > CompanyValidationRules.logo.maxSize) {
    return { valid: false, error: CompanyValidationRules.logo.messages.maxSize };
  }

  if (!CompanyValidationRules.logo.acceptedFormats.includes(file.type)) {
    return { valid: false, error: CompanyValidationRules.logo.messages.invalidFormat };
  }

  return { valid: true };
};

/**
 * Valida el email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { valid: false, error: CompanyValidationRules.email.messages.required };
  }

  if (!CompanyValidationRules.email.pattern.test(email)) {
    return { valid: false, error: CompanyValidationRules.email.messages.invalid };
  }

  return { valid: true };
};

/**
 * Valida las coordenadas de una sucursal
 */
export const validateCoordinates = (lat: number | null, lng: number | null): ValidationResult => {
  if (lat !== null) {
    if (lat < BranchValidationRules.coordinates.lat.min || lat > BranchValidationRules.coordinates.lat.max) {
      return { valid: false, error: BranchValidationRules.coordinates.lat.messages.invalid };
    }
  }

  if (lng !== null) {
    if (lng < BranchValidationRules.coordinates.lng.min || lng > BranchValidationRules.coordinates.lng.max) {
      return { valid: false, error: BranchValidationRules.coordinates.lng.messages.invalid };
    }
  }

  return { valid: true };
};
