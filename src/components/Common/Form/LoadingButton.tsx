import React from 'react';
import { Button } from '../../Atoms';

interface LoadingButtonProps {
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
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
      loading={loading}
      disabled={disabled || loading}
    >
      {children}
    </Button>
  );
};