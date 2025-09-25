// ==========================================
// LOGIN FORM WITH REDUX - EXAMPLE IMPLEMENTATION
// ==========================================

import React from 'react';
import { Form } from 'reactstrap';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { RememberMeCheckbox } from './RememberMeCheckbox';
import { LoginButton } from './LoginButton';
import { LoginAlert } from './LoginAlert';
import { useLoginForm } from '../hooks/useLoginForm';
import { useUserAuth } from '../hooks/useUserAuth';
import type { LoginCredentials } from '../models';

interface LoginFormWithReduxProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginFormWithRedux: React.FC<LoginFormWithReduxProps> = ({
  onSuccess,
  onError
}) => {
  const {
    formData,
    setField,
    validateForm,
    resetForm
  } = useLoginForm();

  const {
    login,
    isLoading,
    error,
    clearAuthError
  } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous Redux error
    clearAuthError();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Get sanitized form values
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      // Execute login using Redux
      const result = await login(credentials);

      if (result.success) {
        // Success callback
        onSuccess?.();
        // Reset form
        resetForm();
      } else {
        // Handle login error
        onError?.(result.error || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      onError?.(errorMessage);
    }
  };

  const handleFieldChange = (field: keyof LoginCredentials) => (value: any) => {
    // Clear Redux error when user starts typing
    if (error) {
      clearAuthError();
    }
    setField(field, value);
  };

  return (
    <div className="p-2">
      <Form className="form-horizontal" onSubmit={handleSubmit}>
        {/* Redux Error Alert */}
        <LoginAlert
          message={error || ''}
          type="error"
          onDismiss={clearAuthError}
        />

        {/* Email Field */}
        <EmailField
          value={formData.email}
          onChange={handleFieldChange('email')}
          error={formData.errors.email}
          disabled={isLoading}
        />

        {/* Password Field */}
        <PasswordField
          value={formData.password}
          onChange={handleFieldChange('password')}
          error={formData.errors.password}
          disabled={isLoading}
        />

        {/* Remember Me Checkbox */}
        <div className="float-end">
          <RememberMeCheckbox
            checked={formData.rememberMe || false}
            onChange={handleFieldChange('rememberMe')}
            disabled={isLoading}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-end">
          <p className="mb-0">
            <a href="/forgot-password" className="text-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-3 d-grid">
          <LoginButton
            loading={isLoading}
            disabled={isLoading}
          />
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

        {/* Forgot Password Link */}
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