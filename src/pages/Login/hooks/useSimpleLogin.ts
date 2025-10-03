import { useState } from 'react';
import { useForm } from '../../../hooks/form/useForm';
import { validateLoginForm } from '../utils/loginValidators';
import { useLoginRequest } from './useLoginRequest';
import type { LoginCredentials } from '../models';

const initialLoginData: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false
};

export const useSimpleLogin = () => {
  const [generalError, setGeneralError] = useState<string>('');
  const {
    executeLogin,
    isLoading: loginLoading,
    error: loginError,
    clearError: clearLoginError
  } = useLoginRequest();

  const {
    formData,
    setField,
    validateForm,
    resetForm,
    setSubmitting,
    getFormValues
  } = useForm(initialLoginData);

  // 1. Clear all errors
  const clearAllErrors = () => {
    setGeneralError('');
    clearLoginError();
  };

  // 2. Validate form data
  const validateFormData = (): boolean => {
    return validateForm((data) => validateLoginForm(data));
  };

  // 3. Handle successful login
  const handleLoginSuccess = () => {
    resetForm(initialLoginData);
  };

  // 4. Execute login process
  const performLogin = async (credentials: LoginCredentials) => {
    const result = await executeLogin(credentials);

    if (result.success) {
      handleLoginSuccess();
    }

    return result;
  };

  // Main submit handler - orchestrates all responsibilities
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Step 1: Clear previous errors
    clearAllErrors();

    // Step 2: Validate form
    if (!validateFormData()) {
      return;
    }

    try {
      // Step 3: Start loading state
      setSubmitting(true);

      // Step 4: Get form data and execute login
      const credentials = getFormValues();
      await performLogin(credentials);

    } catch (error: any) {
      // Step 5: Handle unexpected errors
      const errorMessage = error.message || 'Error inesperado';
      setGeneralError(errorMessage);
    } finally {
      // Step 6: Reset loading state
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof LoginCredentials) => (value: any) => {
    if (generalError) setGeneralError('');
    if (loginError) clearLoginError();
    setField(field, value);
  };

  // Expose clearAllErrors as clearErrors for external use
  const clearErrors = clearAllErrors;

  const isSubmitting = formData.isSubmitting || loginLoading;
  const displayError = generalError || loginError;

  return {
    // Form data and validation
    formData,

    // Event handlers
    handleSubmit,
    handleFieldChange,
    clearErrors,

    // State
    isSubmitting,
    displayError
  };
};