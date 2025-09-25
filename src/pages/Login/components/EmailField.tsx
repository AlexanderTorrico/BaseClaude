import React from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder = 'Ingresa tu email',
  label = 'Email',
  required = true
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormGroup className="mb-3">
      <Label htmlFor="email" className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        invalid={!!error}
        autoComplete="email"
        className="form-control"
      />
      {error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};