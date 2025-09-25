// ==========================================
// USE LOGIN FORM HOOK - FUNCTIONAL APPROACH
// ==========================================

import { useState, useCallback } from 'react';
import type { LoginCredentials, LoginFormData, LoginFormErrors } from '../models';
import { validateField, validateLoginForm } from '../utils/loginValidators';
import { createDefaultLoginCredentials, sanitizeLoginCredentials } from '../utils/loginHelpers';

interface UseLoginFormReturn {
  formData: LoginFormData;
  setField: (field: keyof LoginCredentials, value: any) => void;
  setError: (field: keyof LoginFormErrors, error: string) => void;
  clearError: (field: keyof LoginFormErrors) => void;
  clearAllErrors: () => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  getFormValues: () => LoginCredentials;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>(() => ({
    ...createDefaultLoginCredentials(),
    errors: {},
    isSubmitting: false
  }));

  // Set field value and validate on change
  const setField = useCallback((field: keyof LoginCredentials, value: any) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value
      };

      // Real-time validation for this field
      if (typeof value === 'string' && value.trim()) {
        const fieldError = validateField(field, value);
        newFormData.errors = {
          ...prev.errors,
          [field]: fieldError
        };
      } else if (prev.errors[field as keyof LoginFormErrors]) {
        // Clear error if field becomes empty (let form validation handle required fields)
        const { [field as keyof LoginFormErrors]: removed, ...restErrors } = prev.errors;
        newFormData.errors = restErrors;
      }

      return newFormData;
    });
  }, []);

  // Set specific field error
  const setError = useCallback((field: keyof LoginFormErrors, error: string) => {
    setFormData(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));
  }, []);

  // Clear specific field error
  const clearError = useCallback((field: keyof LoginFormErrors) => {
    setFormData(prev => {
      const { [field]: removed, ...restErrors } = prev.errors;
      return {
        ...prev,
        errors: restErrors
      };
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      errors: {}
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const credentials = sanitizeLoginCredentials({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });

    const validation = validateLoginForm(credentials);

    setFormData(prev => ({
      ...prev,
      errors: validation.errors
    }));

    return validation.isValid;
  }, [formData.email, formData.password, formData.rememberMe]);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData({
      ...createDefaultLoginCredentials(),
      errors: {},
      isSubmitting: false
    });
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((submitting: boolean) => {
    setFormData(prev => ({
      ...prev,
      isSubmitting: submitting
    }));
  }, []);

  // Get sanitized form values
  const getFormValues = useCallback((): LoginCredentials => {
    return sanitizeLoginCredentials({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });
  }, [formData.email, formData.password, formData.rememberMe]);

  return {
    formData,
    setField,
    setError,
    clearError,
    clearAllErrors,
    validateForm,
    resetForm,
    setSubmitting,
    getFormValues
  };
};