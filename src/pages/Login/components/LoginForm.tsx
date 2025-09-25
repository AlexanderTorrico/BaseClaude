import React, { useState } from 'react';
import { Form, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { RememberMeCheckbox } from './RememberMeCheckbox';
import { LoginButton } from './LoginButton';
import { LoginAlert } from './LoginAlert';
import { useLoginForm } from '../hooks/useLoginForm';
import { loginUseCase } from '../usecases/loginUseCase';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError
}) => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string>('');
  const {
    formData,
    setField,
    validateForm,
    resetForm,
    setSubmitting,
    getFormValues
  } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous general error
    setGeneralError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Get sanitized form values
      const credentials = getFormValues();

      // Execute login use case
      const loginWithDependencies = loginUseCase();
      const result = await loginWithDependencies(credentials);

      if (result.success) {
        // Success callback
        onSuccess?.();

        // Navigate to dashboard
        navigate('/dashboard');

        // Reset form
        resetForm();
      } else {
        // Handle login error
        setGeneralError(result.error || 'Error al iniciar sesión');
        onError?.(result.error || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error inesperado al iniciar sesión';
      setGeneralError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData) => (value: any) => {
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
    setField(field, value);
  };

  return (
    <div className="p-2">
      <Form className="form-horizontal" onSubmit={handleSubmit}>
        {/* General Error Alert */}
        <LoginAlert
          message={generalError}
          type="error"
          onDismiss={() => setGeneralError('')}
        />

        {/* Email Field */}
        <EmailField
          value={formData.email}
          onChange={handleFieldChange('email')}
          error={formData.errors.email}
          disabled={formData.isSubmitting}
        />

        {/* Password Field */}
        <PasswordField
          value={formData.password}
          onChange={handleFieldChange('password')}
          error={formData.errors.password}
          disabled={formData.isSubmitting}
        />

        {/* Remember Me Checkbox */}
        <div className="float-end">
          <RememberMeCheckbox
            checked={formData.rememberMe || false}
            onChange={handleFieldChange('rememberMe')}
            disabled={formData.isSubmitting}
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
            loading={formData.isSubmitting}
            disabled={formData.isSubmitting}
          />
        </div>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="mb-0">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-primary fw-semibold">
              Regístrate
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};