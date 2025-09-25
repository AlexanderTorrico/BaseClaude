import React from 'react';
import { Spinner } from 'reactstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  color?: string;
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'sm',
  color = 'primary',
  className = '',
  text
}) => {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <Spinner size={size} color={color} />
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};