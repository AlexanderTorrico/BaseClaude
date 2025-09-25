import React from 'react';
import { Alert } from 'reactstrap';

interface LoginAlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const LoginAlert: React.FC<LoginAlertProps> = ({
  message,
  type = 'error',
  onDismiss,
  dismissible = true
}) => {
  const getAlertColor = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'danger';
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✕';
    }
  };

  if (!message) return null;

  return (
    <Alert
      color={getAlertColor()}
      isOpen={!!message}
      toggle={dismissible ? onDismiss : undefined}
      className="mb-3"
      fade={true}
      timeout={150}
    >
      <span className="me-2">{getAlertIcon()}</span>
      {message}
    </Alert>
  );
};