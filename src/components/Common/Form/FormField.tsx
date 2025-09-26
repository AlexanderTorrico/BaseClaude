import React from 'react';
import { Input } from '../../Atoms';

interface FormFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  className?: string;
  id?: string;
  name?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      {...props}
      onChange={handleChange}
    />
  );
};