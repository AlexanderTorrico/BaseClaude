import React, { useState } from 'react';
import { FormGroup, Label, Input, FormFeedback, InputGroup, InputGroupText, Button } from 'reactstrap';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showToggle?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder = 'Ingresa tu contraseña',
  label = 'Contraseña',
  required = true,
  showToggle = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormGroup className="mb-3">
      <Label htmlFor="password" className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </Label>
      <InputGroup>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          invalid={!!error}
          autoComplete="current-password"
        />
        {showToggle && (
          <InputGroupText
            tag={Button}
            color="light"
            outline
            onClick={togglePasswordVisibility}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            {showPassword ? '🙈' : '👁️'}
          </InputGroupText>
        )}
      </InputGroup>
      {error && <FormFeedback style={{ display: 'block' }}>{error}</FormFeedback>}
    </FormGroup>
  );
};