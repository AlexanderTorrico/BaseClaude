import React, { useState } from 'react';
import { Form } from 'reactstrap';
import { FormField, LoadingButton, CheckboxField, AlertMessage } from '../../../components/Common/Form';
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
        <FormField
          label="Email"
          type="email"
          placeholder="Ingresa tu email"
          value={formData.email}
          onChange={handleFieldChange('email')}
          error={formData.errors.email}
          disabled={isSubmitting}
          required
        />

        {/* Password Field */}
        <FormField
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleFieldChange('password')}
          error={formData.errors.password}
          disabled={isSubmitting}
          required
        />

        {/* Remember Me Checkbox */}
        <div className="float-end mb-3">
          <CheckboxField
            label="Recordarme"
            checked={formData.rememberMe || false}
            onChange={handleFieldChange('rememberMe')}
            disabled={isSubmitting}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-end mb-3">
          <p className="mb-0">
            <a href="/forgot-password" className="text-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-3 d-grid">
          <LoadingButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Iniciar Sesión
          </LoadingButton>
        </div>

        {/* Social Login Section */}
        <div className="mt-4 text-center">
          <h5 className="font-size-14 mb-3">Sign in with</h5>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a
                href="#"
                className="social-list-item bg-primary text-white border-primary"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Facebook login - implement as needed');
                }}
              >
                <i className="mdi mdi-facebook" />
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="#"
                className="social-list-item bg-danger text-white border-danger"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Google login - implement as needed');
                }}
              >
                <i className="mdi mdi-google" />
              </a>
            </li>
          </ul>
        </div>

        {/* Additional Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-muted">
            <i className="mdi mdi-lock me-1" />
            Forgot your password?
          </a>
        </div>
      </Form>
    </div>
  );
};