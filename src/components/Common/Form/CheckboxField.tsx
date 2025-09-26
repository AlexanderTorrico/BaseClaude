import React from 'react';
import { Checkbox } from '../../Atoms';

interface CheckboxFieldProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  error?: string;
  description?: string;
  className?: string;
  id?: string;
  name?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Checkbox
      {...props}
      onChange={handleChange}
    />
  );
};