import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

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
  
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
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

  // Clases base con soporte dark/light mode
  const baseCheckboxClasses = [
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
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-check-label',
    'cursor-pointer',
    'select-none',
    disabled ? 'cursor-not-allowed opacity-50' : '',
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
  ].filter(Boolean).join(' ');

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

Checkbox.propTypes = {
  /** Texto de la etiqueta del checkbox */
  label: PropTypes.string,
  /** Si el checkbox está marcado */
  checked: PropTypes.bool,
  /** Si el checkbox está en estado indeterminado */
  indeterminate: PropTypes.bool,
  /** Si el checkbox está deshabilitado */
  disabled: PropTypes.bool,
  /** Tamaño del checkbox: xs=muy pequeño, sm=pequeño, md=mediano(defecto), lg=grande, xl=muy grande */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Variante de color del checkbox */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  /** Texto de descripción adicional */
  description: PropTypes.string,
  /** Mensaje de error a mostrar */
  error: PropTypes.string,
  /** ID único del checkbox */
  id: PropTypes.string,
  /** Nombre del checkbox para formularios */
  name: PropTypes.string,
  /** Valor del checkbox */
  value: PropTypes.string,
  /** Clases CSS adicionales */
  className: PropTypes.string,
  /** Función a ejecutar al cambiar el estado */
  onChange: PropTypes.func
};

export default Checkbox;