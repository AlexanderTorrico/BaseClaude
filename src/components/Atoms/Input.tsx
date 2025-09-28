import React, { forwardRef, useMemo, useState } from 'react';

/**
 * Componente Input - Átomo base para campos de entrada
 *
 * Campo de entrada altamente personalizable con etiquetas, estados de error,
 * soporte para íconos y modos dark/light automático.
 *
 * @component
 * @example
 * // Input básico
 * <Input label="Nombre" placeholder="Ingresa tu nombre" />
 *
 * // Input con ícono y validación
 * <Input
 *   label="Email"
 *   type="email"
 *   icon={<Icon name="mail" />}
 *   error="Email inválido"
 * />
 *
 * // Input de solo lectura
 * <Input label="ID" value="12345" readonly />
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'underlined';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  className?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  error,
  helperText,
  disabled = false,
  readonly = false,
  required = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  className = '',
  id,
  name,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  
  const baseInputClasses = 'form-control border transition-all duration-200 focus:outline-none';
  
  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large'
  const sizeClasses = {
    xs: 'form-control-sm px-2 py-1 text-xs',     // Extra pequeño - para filtros inline
    sm: 'form-control-sm px-3 py-1.5 text-sm',  // Pequeño - para formularios compactos
    md: 'px-3 py-2 text-base',                  // Mediano - por defecto, equilibrado
    lg: 'form-control-lg px-4 py-3 text-lg',    // Grande - para campos principales
    xl: 'form-control-lg px-5 py-4 text-xl'     // Extra grande - para landing pages
  };

  // Variantes de estilo - Automáticamente adaptan en dark/light mode
  const variantClasses = {
    default: 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400',
    filled: 'bg-light border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:focus:bg-gray-600 dark:text-white',
    underlined: 'border-0 border-bottom border-gray-300 rounded-0 focus:border-primary focus:ring-0 focus:shadow-none dark:border-gray-600 dark:bg-transparent dark:text-white dark:focus:border-primary-400'
  };

  // Estados del input con soporte dark/light
  const stateClasses = {
    error: 'border-danger focus:border-danger focus:ring-danger focus:ring-opacity-20 dark:border-red-500 dark:focus:border-red-400',
    disabled: 'bg-light text-muted cursor-not-allowed dark:bg-gray-800 dark:text-gray-500',
    readonly: 'bg-light dark:bg-gray-700 dark:text-gray-300'
  };

  // Optimizar clases de input con useMemo
  const inputClasses = useMemo(() => {
    const classes = [
      baseInputClasses,
      sizeClasses[size],
      variantClasses[variant],
      error && stateClasses.error,
      disabled && stateClasses.disabled,
      readonly && stateClasses.readonly,
      icon && (iconPosition === 'left' ? 'ps-5' : 'pe-5'),
      className
    ];
    
    return classes.filter(Boolean).join(' ');
  }, [size, variant, error, disabled, readonly, icon, iconPosition, className]);

  // Generar ID único solo una vez
  const [inputId] = React.useState(() => {
    return id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  });

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label fw-medium mb-2">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      <div className="position-relative">
        {icon && iconPosition === 'left' && (
          <div className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
            {React.cloneElement(icon, {
              className: `${icon.props.className || ''} ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`
            })}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted">
            {React.cloneElement(icon, {
              className: `${icon.props.className || ''} ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`
            })}
          </div>
        )}
      </div>
      
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block mt-1 text-danger small">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="form-text mt-1 text-muted small">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Optimizar con React.memo
const MemoizedInput = React.memo(Input, (prevProps, nextProps) => {
  // Comparación optimizada para Input
  const criticalProps = [
    'type', 'value', 'defaultValue', 'placeholder', 'disabled', 'readonly',
    'error', 'size', 'variant', 'className', 'onChange'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedInput.displayName = 'Input';
export default MemoizedInput;
