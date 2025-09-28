import React from 'react';
import { Button } from 'reactstrap';

interface LoadingButtonProps {
  loading?: boolean;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  block?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  disabled = false,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      )}
      {children}
    </Button>
  );
};