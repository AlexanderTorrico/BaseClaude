import React from 'react';
import { AuthLayout } from '../shared/components/AuthLayout';
import { LoginForm } from './components/LoginForm';

const LoginPage: React.FC = () => {
  const handleLoginSuccess = () => {
    // Additional success handling if needed
    console.log('Login successful');
  };

  const handleLoginError = (error: string) => {
    // Additional error handling if needed
    console.error('Login error:', error);
  };

  return (
    <AuthLayout
      title="¡Te damos la bienvenida!"
      subtitle="Inicia sesión para continuar con Skote."
      showBranding={true}
    >
      <div className="p-2">
        <LoginForm
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;