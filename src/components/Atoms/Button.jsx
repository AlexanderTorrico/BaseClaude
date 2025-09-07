import React from 'react';
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
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  // Clases base con soporte automático para dark/light mode
  const baseClasses = 'btn d-inline-flex align-items-center justify-content-center gap-2 border-0 fw-medium text-decoration-none transition-all duration-200';
  
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

  // Estilos de hover dinámicos
  const getHoverStyles = () => ({
    onMouseEnter: (e) => {
      if (!disabled && !loading) {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        e.target.style.filter = 'brightness(1.1)';
      }
    },
    onMouseLeave: (e) => {
      if (!disabled && !loading) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        e.target.style.filter = 'brightness(1)';
      }
    },
    onMouseDown: (e) => {
      if (!disabled && !loading) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
      }
    },
    onMouseUp: (e) => {
      if (!disabled && !loading) {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }
    }
  });
  
  const disabledClasses = 'opacity-60 cursor-not-allowed pointer-events-none';
  const fullWidthClass = fullWidth ? 'w-100' : '';
  
  const buttonClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size],
    disabled ? disabledClasses : '',
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    
    return React.cloneElement(icon, {
      className: `${icon.props.className || ''} ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`
    });
  };

  const renderContent = () => {
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
        {renderIcon()}
      </>
    ) : (
      <>
        {renderIcon()}
        <span>{children}</span>
      </>
    );
  };

  const hoverHandlers = getHoverStyles();

  return (
    <button
      className={buttonClasses}
      style={{
        ...(size === 'sm' ? customSizeStyles.sm : {}),
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra inicial
        ...props.style
      }}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      aria-disabled={disabled || loading}
      {...hoverHandlers}
      {...props}
    >
      {renderContent()}
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

export default Button;