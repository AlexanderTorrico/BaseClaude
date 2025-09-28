import React, { useState } from 'react';
import { Form } from 'reactstrap';
import { AlertMessage } from '../../../components/Common/Form';
import { Input } from '../../../components/Atoms';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useForm } from '../../../hooks/form/useForm';
import { validateLoginForm } from '../utils/loginValidators';
import { sanitizeLoginCredentials } from '../utils/loginHelpers';
import type { LoginCredentials } from '../models';

interface SimpleLoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const initialLoginData: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false
};

export const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({
  onSuccess,
  onError
}) => {
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

  const isSubmitting = formData.isSubmitting || isLoading;
  const displayError = generalError || error;

  return (
    <div className="p-2">
      <Form className="form-horizontal" onSubmit={handleSubmit}>
        {/* Error Alert */}
        <AlertMessage
          message={displayError || ''}
          type="error"
          onDismiss={() => {
            setGeneralError('');
            clearAuthError();
          }}
        />

        {/* Email Field */}
        <Input
          label="Email"
          type="email"
          placeholder="Ingresa tu email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email')(e.target.value)}
          error={formData.errors.email}
          disabled={isSubmitting}
          required
        />

        {/* Password Field */}
        <Input
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={(e) => handleFieldChange('password')(e.target.value)}
          error={formData.errors.password}
          disabled={isSubmitting}
          required
        />

        {/* Remember Me Checkbox */}
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="customControlInline"
            checked={formData.rememberMe || false}
            onChange={(e) => handleFieldChange('rememberMe')(e.target.checked)}
            disabled={isSubmitting}
          />
          <label
            className="form-check-label"
            htmlFor="customControlInline"
          >
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <div className="mt-3 d-grid">
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </div>

      </Form>
    </div>
  );
};