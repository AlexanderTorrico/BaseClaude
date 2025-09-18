import React, { forwardRef, useMemo } from 'react';
/**
 * Componente Checkbox - Átomo base para casillas de verificación
 * 
 * Checkbox estilizado con soporte para estado indeterminado, múltiples tamaños
 * y variantes de color. Adaptación automática a modos dark/light.
 * 
 * @component
 * @example
 * // Checkbox básico
 * <Checkbox label="Acepto los términos" />
 * 
 * // Checkbox controlado
 * <Checkbox 
 *   label="Activo" 
 *   checked={isActive}
 *   onChange={(e) => setIsActive(e.target.checked)}
 * />
 * 
 * // Checkbox indeterminado
 * <Checkbox label="Seleccionar todos" indeterminate />
 */

const Checkbox = forwardRef(({ 
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  variant = 'primary',
  description,
  error,
  id,
  name,
  value,
  className = '',
  onChange,
  ...props 
}, ref) => {
  
  // Generar ID único solo una vez usando useRef para mantener estabilidad
  const stableId = React.useRef(id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`);
  const checkboxId = stableId.current;
  
  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large'
  const sizeClasses = {
    xs: 'w-3 h-3',  // Extra pequeño - para tablas densas
    sm: 'w-4 h-4',  // Pequeño - para listas compactas
    md: 'w-5 h-5',  // Mediano - por defecto, uso general
    lg: 'w-6 h-6',  // Grande - para formularios principales
    xl: 'w-8 h-8'   // Extra grande - para interfaces touch
  };

  // Variantes de color - Automáticamente adaptan en dark/light mode
  const variantClasses = {
    primary: 'accent-primary dark:accent-primary-400',
    secondary: 'accent-secondary dark:accent-secondary-400',
    success: 'accent-success dark:accent-success-400',
    danger: 'accent-danger dark:accent-danger-400',
    warning: 'accent-warning dark:accent-warning-400',
    info: 'accent-info dark:accent-info-400'
  };

  // Optimizar clases con useMemo
  const baseCheckboxClasses = useMemo(() => {
    const classes = [
      'form-check-input',
      'border-2',
      'cursor-pointer',
      'transition-all',
      'duration-200',
      sizeClasses[size],
      variantClasses[variant],
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-opacity-75',
      error ? 'border-danger dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
      'dark:bg-gray-800 dark:checked:bg-primary-600',
      className
    ];
    return classes.filter(Boolean).join(' ');
  }, [size, variant, disabled, error, className]);

  const labelClasses = useMemo(() => {
    const classes = [
      'form-check-label',
      'cursor-pointer',
      'select-none',
      disabled ? 'cursor-not-allowed opacity-50' : '',
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
    ];
    return classes.filter(Boolean).join(' ');
  }, [disabled, size]);

  React.useEffect(() => {
    if (ref?.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  return (
    <div className={`form-check ${size === 'sm' ? 'form-check-sm' : ''}`}>
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        name={name}
        value={value}
        className={baseCheckboxClasses}
        checked={checked}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${checkboxId}-error` : description ? `${checkboxId}-desc` : undefined}
        {...props}
      />
      
      {label && (
        <label htmlFor={checkboxId} className={labelClasses}>
          {label}
        </label>
      )}
      
      {description && !error && (
        <div id={`${checkboxId}-desc`} className="form-text text-muted small mt-1">
          {description}
        </div>
      )}
      
      {error && (
        <div id={`${checkboxId}-error`} className="invalid-feedback d-block mt-1 text-danger small">
          {error}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox// Optimizar con React.memo
const MemoizedCheckbox = React.memo(Checkbox, (prevProps, nextProps) => {
  // Comparación optimizada para Checkbox
  const criticalProps = [
    'checked', 'indeterminate', 'disabled', 'readOnly', 'size', 'variant',
    'label', 'error', 'description', 'className', 'onChange'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedCheckbox.displayName = 'Checkbox';
export default MemoizedCheckbox;
