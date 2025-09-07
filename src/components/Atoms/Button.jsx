import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Button - Átomo base para botones del sistema
 * 
 * Botón altamente personalizable con múltiples variantes, tamaños y estados.
 * Soporta íconos, estado de carga, modos dark/light automático y efectos hover interactivos.
 * 
 * TAMAÑO ESTÁNDAR: 'sm' - altura exacta de 27.46px (personalizado)
 * EFECTOS HOVER: Elevación, sombra y brillo al pasar el mouse
 * 
 * @component
 * @example
 * // Botón estándar con hover (27.46px alto exacto)
 * <Button onClick={() => alert('Hola mundo')}>Crear Usuario</Button>
 * 
 * // Botón con ícono y efectos hover
 * <Button variant="primary" icon={<Icon name="user" />}>
 *   Agregar Usuario
 * </Button>
 * 
 * // Botón en estado de carga (sin efectos hover)
 * <Button loading variant="success">Guardando...</Button>
 * 
 * // Botones de acción para tablas con hover
 * <Button variant="danger" size="sm" onClick={handleDelete}>
 *   <i className="mdi mdi-delete"></i>
 * </Button>
 */
const Button = ({ 
  variant = 'primary', 
  size = 'sm', // Cambiado por defecto a 'sm'
  disabled = false, 
  loading = false,
  fontWeight = 'light',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  // Mapeo de pesos de fuente
  const fontWeightClasses = {
    normal: 'fw-normal',
    medium: 'fw-medium', 
    bold: 'fw-bold',
    light: 'fw-light',
    semibold: 'fw-semibold'
  };

  // Clases base con soporte automático para dark/light mode (sin fontWeight, se maneja en estilos inline)
  const baseClasses = `btn d-inline-flex align-items-center justify-content-center gap-2 border-0 text-decoration-none transition-all duration-200`;
  
  // Variantes de color con efectos hover mejorados
  const variantClasses = {
    primary: 'btn-primary transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    secondary: 'btn-secondary transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    danger: 'btn-danger transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    success: 'btn-success transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    warning: 'btn-warning transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    info: 'btn-info transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    light: 'btn-light transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    dark: 'btn-dark transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    'outline-primary': 'btn-outline-primary transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    'outline-secondary': 'btn-outline-secondary transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    'outline-danger': 'btn-outline-danger transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0',
    'outline-success': 'btn-outline-success transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
  };
  
  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large'
  // NOTA: 'sm' es el estándar personalizado - Alto: exactamente 27.46px
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',      // Extra pequeño - para indicadores compactos
    sm: 'btn-custom-sm',                  // Pequeño - ESTÁNDAR personalizado (27.46px alto)
    md: 'px-4 py-2 text-base rounded-md', // Mediano - para acciones destacadas
    lg: 'btn-lg',                         // Grande - usa Bootstrap btn-lg
    xl: 'px-8 py-4 text-xl rounded-xl'   // Extra grande - para landing pages
  };

  // Estilos inline para tamaño sm personalizado (27.46px exacto)
  const customSizeStyles = {
    sm: {
      padding: '3.23px 12px',           // Ajustado para altura exacta de 27.46px (reducido de 3.73px)
      fontSize: '0.875rem',             // 14px, mismo que Bootstrap btn-sm
      lineHeight: '1.5',               // Altura de línea estándar
      height: '27.46px',               // Altura fija exacta
      boxSizing: 'border-box',         // Incluir borders y padding en la altura
      transition: 'all 0.2s ease-in-out', // Transición suave para hover
      cursor: 'pointer'                // Cursor pointer explícito
    }
  };

  // Estilos de hover optimizados con useCallback
  const handleMouseEnter = useCallback((e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      e.target.style.filter = 'brightness(1.1)';
    }
  }, [disabled, loading]);

  const handleMouseLeave = useCallback((e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      e.target.style.filter = 'brightness(1)';
    }
  }, [disabled, loading]);

  const handleMouseDown = useCallback((e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback((e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }
  }, [disabled, loading]);
  
  // Optimizar clases con useMemo
  const buttonClasses = useMemo(() => {
    const classes = [
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size],
      disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '',
      fullWidth ? 'w-100' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  }, [baseClasses, variant, size, disabled, fullWidth, className]);

  // Optimizar renderizado de ícono con useMemo
  const renderedIcon = useMemo(() => {
    if (!icon) return null;
    
    return React.cloneElement(icon, {
      className: `${icon.props.className || ''} ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`
    });
  }, [icon, size]);

  // Optimizar contenido con useMemo
  const content = useMemo(() => {
    if (loading) {
      return (
        <>
          <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
          {children && <span>Cargando...</span>}
        </>
      );
    }

    if (!icon) return children;

    return iconPosition === 'right' ? (
      <>
        <span>{children}</span>
        {renderedIcon}
      </>
    ) : (
      <>
        {renderedIcon}
        <span>{children}</span>
      </>
    );
  }, [loading, children, icon, iconPosition, renderedIcon]);

  // Optimizar estilos inline con useMemo
  const buttonStyle = useMemo(() => ({
    ...(size === 'sm' ? customSizeStyles.sm : {}),
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontWeight: (fontWeight === 'light' ? '300' : 
                fontWeight === 'normal' ? '400' : 
                fontWeight === 'medium' ? '500' : 
                fontWeight === 'semibold' ? '600' : 
                fontWeight === 'bold' ? '700' : '400') + ' !important',
    ...props.style
  }), [size, fontWeight, props.style]);

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      aria-disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {content}
    </button>
  );
};

Button.propTypes = {
  /** Variante de color del botón */
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary', 'outline-danger', 'outline-success'
  ]),
  /** Tamaño del botón: xs=muy pequeño, sm=ESTÁNDAR(defecto 27.46px exacto), md=mediano, lg=grande, xl=muy grande */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Si el botón está deshabilitado */
  disabled: PropTypes.bool,
  /** Si muestra estado de carga con spinner */
  loading: PropTypes.bool,
  /** Peso de la fuente del texto */
  fontWeight: PropTypes.oneOf(['normal', 'medium', 'bold', 'light', 'semibold']),
  /** Elemento de ícono React */
  icon: PropTypes.element,
  /** Posición del ícono respecto al texto */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** Si el botón ocupa todo el ancho disponible */
  fullWidth: PropTypes.bool,
  /** Contenido del botón */
  children: PropTypes.node,
  /** Clases CSS adicionales */
  className: PropTypes.string,
  /** Función a ejecutar al hacer click */
  onClick: PropTypes.func,
  /** Tipo HTML del botón */
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

// Optimizar con React.memo para evitar re-renders innecesarios
const MemoizedButton = React.memo(Button, (prevProps, nextProps) => {
  // Comparación optimizada - solo comparar props que afectan la renderización
  const criticalProps = [
    'variant', 'size', 'disabled', 'loading', 'fontWeight',
    'children', 'icon', 'iconPosition', 'fullWidth', 'className'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedButton.displayName = 'Button';
export default MemoizedButton;