import { useState, useCallback } from 'react';

interface UseFormReturn<T> {
  formData: T & { errors: Partial<Record<keyof T, string>>; isSubmitting: boolean };
  setField: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validateForm: (validator: (data: T) => { isValid: boolean; errors: Partial<Record<keyof T, string>> }) => boolean;
  resetForm: (initialData: T) => void;
  setSubmitting: (submitting: boolean) => void;
  getFormValues: () => T;
}

export const useForm = <T extends Record<string, any>>(initialData: T): UseFormReturn<T> => {
  const [formData, setFormData] = useState(() => ({
    ...initialData,
    errors: {} as Partial<Record<keyof T, string>>,
    isSubmitting: false
  }));

  const setField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined
      }
    }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setFormData(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setFormData(prev => {
      const { [field]: removed, ...restErrors } = prev.errors;
      return {
        ...prev,
        errors: restErrors
      };
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      errors: {}
    }));
  }, []);

  const validateForm = useCallback((validator: (data: T) => { isValid: boolean; errors: Partial<Record<keyof T, string>> }) => {
    const cleanData = Object.keys(initialData).reduce((acc, key) => {
      acc[key as keyof T] = formData[key as keyof T];
      return acc;
    }, {} as T);

    const validation = validator(cleanData);

    setFormData(prev => ({
      ...prev,
      errors: validation.errors
    }));

    return validation.isValid;
  }, [formData, initialData]);

  const resetForm = useCallback((newInitialData: T) => {
    setFormData({
      ...newInitialData,
      errors: {},
      isSubmitting: false
    });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setFormData(prev => ({
      ...prev,
      isSubmitting: submitting
    }));
  }, []);

  const getFormValues = useCallback((): T => {
    return Object.keys(initialData).reduce((acc, key) => {
      acc[key as keyof T] = formData[key as keyof T];
      return acc;
    }, {} as T);
  }, [formData, initialData]);

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