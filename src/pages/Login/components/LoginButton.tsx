import React from 'react';
import { Button } from 'reactstrap';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';

interface LoginButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  text?: string;
  loadingText?: string;
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  loading,
  disabled = false,
  onClick,
  type = 'submit',
  text = 'Iniciar Sesión',
  loadingText = 'Iniciando sesión...',
  className = 'w-100'
}) => {
  return (
    <Button
      color="primary"
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <LoadingSpinner text={loadingText} />
      ) : (
        text
      )}
    </Button>
  );
};