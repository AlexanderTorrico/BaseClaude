import React from 'react';

/**
 * Componente Icon - Átomo base para íconos
 *
 * Wrapper universal para íconos que soporta múltiples librerías (Feather, Bootstrap, FontAwesome)
 * y elementos React personalizados. Incluye animaciones y transformaciones.
 *
 * @component
 * @example
 * // Ícono de Feather Icons
 * <Icon name="User" library="feather" size="lg" color="primary" />
 *
 * // Ícono de Bootstrap
 * <Icon name="house" library="bootstrap" />
 *
 * // Ícono personalizado
 * <Icon name={<CustomIconComponent />} size="md" onClick={handleClick} />
 *
 * // Ícono con animación
 * <Icon name="spinner" spin color="info" />
 */

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type IconColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'muted' | 'white' | 'body';
type IconLibrary = 'feather' | 'bootstrap' | 'fontawesome';
type IconRotation = 90 | 180 | 270;
type IconFlip = 'horizontal' | 'vertical' | 'both';

interface IconProps {
  /** Nombre del ícono (string) o elemento React personalizado */
  name: string | React.ReactElement;
  /** Tamaño del ícono: xs=muy pequeño, sm=pequeño, md=mediano(defecto), lg=grande, xl=muy grande, 2xl=enorme */
  size?: IconSize;
  /** Color del ícono */
  color?: IconColor;
  /** Clases CSS adicionales */
  className?: string;
  /** Función a ejecutar al hacer click (hace el ícono clickeable) */
  onClick?: (e: React.MouseEvent) => void;
  /** Si el ícono debe rotar continuamente */
  spin?: boolean;
  /** Si el ícono debe pulsar (fade in/out) */
  pulse?: boolean;
  /** Rotación del ícono en grados */
  rotate?: IconRotation;
  /** Voltear el ícono */
  flip?: IconFlip;
  /** Librería de íconos a usar */
  library?: IconLibrary;
  [key: string]: any;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  className = '',
  onClick,
  spin = false,
  pulse = false,
  rotate,
  flip,
  library = 'feather',
  ...props
}) => {

  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large', 'huge'
  const sizeStyles: Record<IconSize, React.CSSProperties> = {
    xs: { width: '12px', height: '12px' },    // Extra pequeño - para botones compactos
    sm: { width: '16px', height: '16px' },    // Pequeño - para texto inline
    md: { width: '20px', height: '20px' },    // Mediano - por defecto, uso general
    lg: { width: '24px', height: '24px' },    // Grande - para botones importantes
    xl: { width: '32px', height: '32px' },    // Extra grande - para encabezados
    '2xl': { width: '40px', height: '40px' }  // Muy grande - para landing pages
  };

  // Colores disponibles con soporte dark/light mode
  const colorClasses: Record<IconColor, string> = {
    primary: 'text-primary dark:text-primary-400',
    secondary: 'text-secondary dark:text-secondary-400',
    success: 'text-success dark:text-success-400',
    danger: 'text-danger dark:text-danger-400',
    warning: 'text-warning dark:text-warning-400',
    info: 'text-info dark:text-info-400',
    light: 'text-light dark:text-gray-300',
    dark: 'text-dark dark:text-gray-200',
    muted: 'text-muted dark:text-gray-500',
    white: 'text-white dark:text-white',
    body: 'text-body dark:text-gray-200'
  };

  const rotateClasses: Record<IconRotation, string> = {
    90: 'rotate-90',
    180: 'rotate-180',
    270: 'rotate-270'
  };

  const flipClasses: Record<IconFlip, string> = {
    horizontal: 'scale-x-n1',
    vertical: 'scale-y-n1',
    both: 'scale-x-n1 scale-y-n1'
  };

  const baseClasses = [
    'd-inline-block',
    'flex-shrink-0',
    color && colorClasses[color],
    onClick ? 'cursor-pointer' : '',
    spin ? 'animate-spin' : '',
    pulse ? 'animate-pulse' : '',
    rotate && rotateClasses[rotate],
    flip && flipClasses[flip],
    'transition-all duration-200',
    className
  ].filter(Boolean).join(' ');

  const renderFeatherIcon = () => {
    try {
      const FeatherIcon = require(`react-feather`)[name as string];
      if (FeatherIcon) {
        return (
          <FeatherIcon
            className={baseClasses}
            style={sizeStyles[size]}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(e as any) : undefined}
            {...props}
          />
        );
      }
    } catch (error) {
      return renderFallback();
    }
    return renderFallback();
  };

  const renderBootstrapIcon = () => {
    return (
      <i
        className={`bi bi-${name} ${baseClasses}`}
        style={sizeStyles[size]}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(e as any) : undefined}
        {...props}
      />
    );
  };

  const renderFontAwesome = () => {
    return (
      <i
        className={`fas fa-${name} ${baseClasses}`}
        style={sizeStyles[size]}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(e as any) : undefined}
        {...props}
      />
    );
  };

  const renderCustomIcon = () => {
    if (React.isValidElement(name)) {
      return React.cloneElement(name, {
        className: `${name.props.className || ''} ${baseClasses}`,
        style: { ...sizeStyles[size], ...(name.props.style || {}) },
        onClick: onClick || name.props.onClick,
        role: onClick ? 'button' : name.props.role,
        tabIndex: onClick ? 0 : name.props.tabIndex,
        onKeyDown: onClick ? (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(e as any) : name.props.onKeyDown,
        ...props
      });
    }
    return renderFallback();
  };

  const renderFallback = () => {
    return (
      <div
        className={`${baseClasses} d-flex align-items-center justify-content-center bg-light text-muted rounded`}
        style={sizeStyles[size]}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(e as any) : undefined}
        title={`Icon: ${name}`}
        {...props}
      >
        ?
      </div>
    );
  };

  if (React.isValidElement(name)) {
    return renderCustomIcon();
  }

  switch (library) {
    case 'feather':
      return renderFeatherIcon();
    case 'bootstrap':
      return renderBootstrapIcon();
    case 'fontawesome':
      return renderFontAwesome();
    default:
      return renderFeatherIcon();
  }
};

export default Icon;