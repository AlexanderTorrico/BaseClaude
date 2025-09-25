import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label = 'Recordarme'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <FormGroup check className="mb-3">
      <Input
        type="checkbox"
        id="rememberMe"
        name="rememberMe"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <Label check htmlFor="rememberMe" className="form-check-label">
        {label}
      </Label>
    </FormGroup>
  );
};