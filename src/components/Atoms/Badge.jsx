import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Badge - Átomo base para etiquetas y estados
 * 
 * Badge versátil para mostrar estados de usuarios, notificaciones,
 * contadores y etiquetas. Incluye estados predefinidos para gestión de usuarios.
 * 
 * @component
 * @example
 * // Badge de estado de usuario
 * <Badge status="active" />
 * 
 * // Badge personalizado
 * <Badge variant="primary" size="lg">Nuevo</Badge>
 * 
 * // Badge tipo punto
 * <Badge dot status="online" />
 * 
 * // Badge tipo píldora
 * <Badge pill variant="success">Completado</Badge>
 */

const Badge = ({ 
  variant = 'primary',
  status,
  size = 'md',
  pill = false,
  dot = false,
  children,
  className = '',
  ...props 
}) => {
  
  const statusVariants = {
    active: 'success',
    inactive: 'secondary', 
    suspended: 'danger',
    pending: 'warning',
    completed: 'info',
    draft: 'light'
  };

  // Memoizar variant efectivo
  const effectiveVariant = useMemo(() => {
    return status ? statusVariants[status] || 'secondary' : variant;
  }, [status, variant]);
  
  const baseClasses = 'badge d-inline-flex align-items-center gap-1 fw-medium text-decoration-none';
  
  // Variantes de color - Automáticamente adaptan en dark/light mode
  const variantClasses = {
    primary: 'text-bg-primary dark:bg-primary-600 dark:text-white',
    secondary: 'text-bg-secondary dark:bg-secondary-600 dark:text-white',
    success: 'text-bg-success dark:bg-success-600 dark:text-white',
    danger: 'text-bg-danger dark:bg-danger-600 dark:text-white', 
    warning: 'text-bg-warning text-dark dark:bg-warning-600 dark:text-white',
    info: 'text-bg-info dark:bg-info-600 dark:text-white',
    light: 'text-bg-light text-dark border border-light-subtle dark:bg-gray-700 dark:text-white dark:border-gray-600',
    dark: 'text-bg-dark dark:bg-gray-200 dark:text-black',
    'outline-primary': 'bg-transparent text-primary border border-primary dark:border-primary-400 dark:text-primary-400',
    'outline-secondary': 'bg-transparent text-secondary border border-secondary dark:border-secondary-400 dark:text-secondary-400',
    'outline-success': 'bg-transparent text-success border border-success dark:border-success-400 dark:text-success-400',
    'outline-danger': 'bg-transparent text-danger border border-danger dark:border-danger-400 dark:text-danger-400',
    'outline-warning': 'bg-transparent text-warning border border-warning dark:border-warning-400 dark:text-warning-400',
    'outline-info': 'bg-transparent text-info border border-info dark:border-info-400 dark:text-info-400'
  };
  
  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large'
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',    // Extra pequeño - para indicadores mínimos
    sm: 'px-2 py-1 text-xs',        // Pequeño - para contadores
    md: 'px-2.5 py-1.5 text-sm',    // Mediano - por defecto, uso general
    lg: 'px-3 py-2 text-base',      // Grande - para estados importantes
    xl: 'px-4 py-2.5 text-lg'       // Extra grande - para landing pages
  };
  
  // Optimizar clases con useMemo
  const badgeClasses = useMemo(() => {
    const classes = [
      baseClasses,
      variantClasses[effectiveVariant] || variantClasses.primary,
      sizeClasses[size],
      pill ? 'rounded-pill' : 'rounded',
      dot ? 'p-0 border-2 border-white' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  }, [effectiveVariant, size, pill, dot, className]);

  const statusIcons = {
    active: '●',
    inactive: '●', 
    suspended: '●',
    pending: '●',
    completed: '✓',
    draft: '○'
  };

  const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    suspended: 'Suspendido', 
    pending: 'Pendiente',
    completed: 'Completado',
    draft: 'Borrador'
  };

  if (dot) {
    return (
      <span
        className={`${badgeClasses} ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`}
        title={status ? statusLabels[status] : ''}
        {...props}
      />
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {status && !children && (
        <>
          <span className="badge-icon" aria-hidden="true">
            {statusIcons[status]}
          </span>
          {statusLabels[status]}
        </>
      )}
      {children}
    </span>
  );
};

Badge.propTypes = {
  /** Variante de color del badge */
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger',
    'outline-warning', 'outline-info'
  ]),
  /** Estado predefinido para gestión de usuarios */
  status: PropTypes.oneOf(['active', 'inactive', 'suspended', 'pending', 'completed', 'draft']),
  /** Tamaño del badge: xs=muy pequeño, sm=pequeño, md=mediano(defecto), lg=grande, xl=muy grande */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Si el badge tiene forma de píldora (redondeado) */
  pill: PropTypes.bool,
  /** Si el badge es solo un punto indicador */
  dot: PropTypes.bool,
  /** Contenido del badge */
  children: PropTypes.node,
  /** Clases CSS adicionales */
  className: PropTypes.string
};

// Optimizar con React.memo
const MemoizedBadge = React.memo(Badge, (prevProps, nextProps) => {
  // Comparación optimizada para Badge
  const criticalProps = [
    'variant', 'status', 'size', 'pill', 'dot', 'children', 'className'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedBadge.displayName = 'Badge';
export default MemoizedBadge;