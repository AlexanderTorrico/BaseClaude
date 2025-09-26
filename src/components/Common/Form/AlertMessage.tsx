import React from 'react';
import { Alert } from 'reactstrap';

interface AlertMessageProps {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  onDismiss?: () => void;
  dismissible?: boolean;
  className?: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = 'error',
  onDismiss,
  dismissible = true,
  className = ''
}) => {
  if (!message) return null;

  const alertTypeMap = {
    error: 'danger',
    success: 'success',
    warning: 'warning',
    info: 'info'
  };

  const alertType = alertTypeMap[type] || 'danger';

  return (
    <Alert
      color={alertType}
      isOpen={!!message}
      toggle={dismissible ? onDismiss : undefined}
      className={`mb-3 ${className}`}
    >
      {message}
    </Alert>
  );
};