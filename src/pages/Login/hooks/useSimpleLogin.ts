import { useState } from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useForm } from '../../../hooks/form/useForm';
import { validateLoginForm } from '../utils/loginValidators';
import { sanitizeLoginCredentials } from '../utils/loginHelpers';
import type { LoginCredentials } from '../models';

const initialLoginData: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false
};

interface UseSimpleLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useSimpleLogin = ({ onSuccess, onError }: UseSimpleLoginProps = {}) => {
  const [generalError, setGeneralError] = useState<string>('');
  const { login, isLoading, error, clearAuthError } = useAuth();

  const {
    formData,
    setField,
    validateForm,
    resetForm,
    setSubmitting,
    getFormValues
  } = useForm(initialLoginData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralError('');
    clearAuthError();

    // Validate form
    if (!validateForm((data) => validateLoginForm(data))) {
      return;
    }

    try {
      setSubmitting(true);

      // Get sanitized form values
      const credentials = sanitizeLoginCredentials(getFormValues());

      // Execute login
      const result = await login(credentials);

      if (result.success) {
        onSuccess?.();
        resetForm(initialLoginData);
      } else {
        const errorMsg = result.error || 'Error al iniciar sesión';
        setGeneralError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      setGeneralError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof LoginCredentials) => (value: any) => {
    if (generalError) setGeneralError('');
    if (error) clearAuthError();
    setField(field, value);
  };

  const clearErrors = () => {
    setGeneralError('');
    clearAuthError();
  };

  const isSubmitting = formData.isSubmitting || isLoading;
  const displayError = generalError || error;

  return {
    // Form data and validation
    formData,

    // Event handlers
    handleSubmit,
    handleFieldChange,
    clearErrors,

    // State
    isSubmitting,
    displayError,
    generalError,

    // Auth state
    isLoading,
    error
  };
};