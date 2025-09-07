import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Avatar - Átomo base para imágenes de perfil
 * 
 * Avatar versátil que puede mostrar imágenes, iniciales o placeholders.
 * Incluye indicadores de estado (online/offline) y múltiples formas y tamaños.
 * 
 * @component
 * @example
 * // Avatar con imagen
 * <Avatar src="/avatar.jpg" alt="Usuario" />
 * 
 * // Avatar con iniciales
 * <Avatar name="Juan Pérez" />
 * 
 * // Avatar con estado
 * <Avatar name="Ana Martín" status="online" showStatus />
 * 
 * // Avatar personalizado
 * <Avatar initial="AB" variant="success" size="lg" shape="square" />
 */

const Avatar = ({ 
  src,
  alt,
  initial,
  name,
  size = 'md',
  shape = 'circle',
  variant = 'primary',
  status,
  showStatus = false,
  className = '',
  onClick,
  ...props 
}) => {
  
  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large', 'huge'
  const sizeClasses = {
    xs: 'avatar-xs',    // Extra pequeño - para listas densas
    sm: 'avatar-sm',    // Pequeño - para comentarios, mensajes
    md: 'avatar-md',    // Mediano - por defecto, uso general
    lg: 'avatar-lg',    // Grande - para perfiles destacados
    xl: 'avatar-xl',    // Extra grande - para páginas de perfil
    '2xl': 'avatar-2xl' // Muy grande - para landing pages
  };

  // Estilos inline para tamaños (fallback si no hay CSS custom)
  const sizeStyles = {
    xs: { width: '24px', height: '24px', fontSize: '0.75rem' },
    sm: { width: '32px', height: '32px', fontSize: '0.875rem' },
    md: { width: '40px', height: '40px', fontSize: '1rem' },
    lg: { width: '48px', height: '48px', fontSize: '1.125rem' },
    xl: { width: '56px', height: '56px', fontSize: '1.25rem' },
    '2xl': { width: '64px', height: '64px', fontSize: '1.5rem' }
  };

  const shapeClasses = {
    circle: 'rounded-circle',
    square: 'rounded',
    rounded: 'rounded-2'
  };

  // Variantes de color - Automáticamente adaptan en dark/light mode
  const variantClasses = {
    primary: 'bg-primary text-white dark:bg-primary-600',
    secondary: 'bg-secondary text-white dark:bg-secondary-600',
    success: 'bg-success text-white dark:bg-success-600',
    danger: 'bg-danger text-white dark:bg-danger-600',
    warning: 'bg-warning text-dark dark:bg-warning-600 dark:text-white',
    info: 'bg-info text-white dark:bg-info-600',
    light: 'bg-light text-dark border border-light-subtle dark:bg-gray-700 dark:text-white dark:border-gray-600',
    dark: 'bg-dark text-white dark:bg-gray-200 dark:text-black'
  };

  const statusClasses = {
    online: 'bg-success',
    offline: 'bg-secondary', 
    busy: 'bg-danger',
    away: 'bg-warning'
  };

  // Estilos para indicador de estado
  const statusSizeStyles = {
    xs: { width: '6px', height: '6px' },
    sm: { width: '8px', height: '8px' },
    md: { width: '10px', height: '10px' },
    lg: { width: '12px', height: '12px' },
    xl: { width: '14px', height: '14px' },
    '2xl': { width: '16px', height: '16px' }
  };

  // Optimizar clases con useMemo
  const baseClasses = useMemo(() => {
    const classes = [
      'd-inline-flex',
      'align-items-center', 
      'justify-content-center',
      'position-relative',
      'overflow-hidden',
      'user-select-none',
      'flex-shrink-0',
      shapeClasses[shape],
      onClick ? 'cursor-pointer' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  }, [shape, onClick, className]);

  // Optimizar cálculo de iniciales con useMemo
  const initials = useMemo(() => {
    if (initial) return initial.toUpperCase();
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  }, [initial, name]);

  // Optimizar manejo de errores de imagen con useCallback
  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'flex';
    }
  }, []);

  // Optimizar contenido con useMemo
  const avatarContent = useMemo(() => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-100 h-100 object-fit-cover"
          onError={handleImageError}
        />
      );
    }
    
    return (
      <div className={`w-100 h-100 d-flex align-items-center justify-content-center fw-medium ${variantClasses[variant]}`}>
        {initials}
      </div>
    );
  }, [src, alt, name, variant, initials, handleImageError]);

  const statusIndicator = () => {
    if (!showStatus || !status) return null;
    
    return (
      <div 
        className={[
          'position-absolute',
          'border border-2 border-white',
          'rounded-circle',
          statusClasses[status],
          'bottom-0 end-0'
        ].join(' ')}
        style={{
          ...statusSizeStyles[size],
          bottom: '0',
          right: '0'
        }}
        title={status}
        aria-label={`Status: ${status}`}
      />
    );
  };

  return (
    <div 
      className={baseClasses}
      style={sizeStyles[size]}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {avatarContent}
      {!src && (
        <div 
          className={`w-100 h-100 d-flex align-items-center justify-content-center fw-medium ${variantClasses[variant]}`}
          style={{ display: 'none' }}
        >
          {initials}
        </div>
      )}
      {statusIndicator()}
    </div>
  );
};

Avatar.propTypes = {
  /** URL de la imagen del avatar */
  src: PropTypes.string,
  /** Texto alternativo para la imagen */
  alt: PropTypes.string, 
  /** Iniciales personalizadas a mostrar */
  initial: PropTypes.string,
  /** Nombre completo para generar iniciales automáticamente */
  name: PropTypes.string,
  /** Tamaño del avatar: xs=muy pequeño, sm=pequeño, md=mediano(defecto), lg=grande, xl=muy grande, 2xl=enorme */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Forma del avatar */
  shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
  /** Variante de color para el fondo cuando no hay imagen */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  /** Estado del usuario */
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  /** Si mostrar el indicador de estado */
  showStatus: PropTypes.bool,
  /** Clases CSS adicionales */
  className: PropTypes.string,
  /** Función a ejecutar al hacer click (hace el avatar clickeable) */
  onClick: PropTypes.func
};

// Optimizar con React.memo
const MemoizedAvatar = React.memo(Avatar, (prevProps, nextProps) => {
  // Comparación optimizada para Avatar
  const criticalProps = [
    'src', 'alt', 'initial', 'name', 'size', 'shape', 'variant',
    'status', 'showStatus', 'className'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedAvatar.displayName = 'Avatar';
export default MemoizedAvatar;