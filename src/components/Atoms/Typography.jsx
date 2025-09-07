import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Typography - Átomo base para elementos de texto
 * 
 * Sistema tipográfico unificado que proporciona consistencia en encabezados,
 * párrafos y texto. Incluye control completo de estilo y adaptación dark/light.
 * 
 * @component
 * @example
 * // Títulos
 * <Typography variant="h1">Título Principal</Typography>
 * <Typography variant="h2" weight="bold">Subtítulo</Typography>
 * 
 * // Texto con estilo
 * <Typography variant="p" color="primary" size="lg">
 *   Texto destacado en azul
 * </Typography>
 * 
 * // Texto truncado
 * <Typography variant="p" truncate className="w-50">
 *   Este texto se cortará con puntos suspensivos
 * </Typography>
 */

const Typography = ({ 
  variant = 'p',
  size,
  weight,
  color,
  align,
  transform,
  decoration,
  lineHeight,
  truncate = false,
  className = '',
  children,
  ...props 
}) => {
  
  const variantTags = {
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    span: 'span',
    small: 'small',
    strong: 'strong',
    em: 'em',
    code: 'code',
    pre: 'pre'
  };

  // Tamaños disponibles: 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'
  // Palabras alternativas: 'tiny', 'small', 'medium', 'large', 'extra-large', 'huge', 'massive'
  const sizeClasses = {
    xs: 'fs-7',     // Extra pequeño - para anotaciones, metadata
    sm: 'fs-6',     // Pequeño - para texto secundario
    md: 'fs-5',     // Mediano - para texto normal
    lg: 'fs-4',     // Grande - para texto destacado
    xl: 'fs-3',     // Extra grande - para subtítulos
    '2xl': 'fs-2',  // Muy grande - para títulos
    '3xl': 'fs-1'   // Enorme - para headings principales
  };

  const weightClasses = {
    100: 'fw-light',
    200: 'fw-light',
    300: 'fw-light',
    400: 'fw-normal',
    500: 'fw-medium',
    600: 'fw-semibold',
    700: 'fw-bold',
    800: 'fw-bold',
    900: 'fw-bold',
    light: 'fw-light',
    normal: 'fw-normal',
    medium: 'fw-medium',
    semibold: 'fw-semibold',
    bold: 'fw-bold'
  };

  // Colores disponibles con soporte dark/light mode
  const colorClasses = {
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
    body: 'text-body dark:text-gray-200',
    'body-emphasis': 'text-body-emphasis dark:text-white',
    'body-secondary': 'text-body-secondary dark:text-gray-400',
    'body-tertiary': 'text-body-tertiary dark:text-gray-500'
  };

  const alignClasses = {
    left: 'text-start',
    center: 'text-center',
    right: 'text-end',
    justify: 'text-justify'
  };

  const transformClasses = {
    uppercase: 'text-uppercase',
    lowercase: 'text-lowercase', 
    capitalize: 'text-capitalize'
  };

  const decorationClasses = {
    underline: 'text-decoration-underline',
    'line-through': 'text-decoration-line-through',
    none: 'text-decoration-none'
  };

  const lineHeightClasses = {
    1: 'lh-1',
    sm: 'lh-sm',
    base: 'lh-base', 
    lg: 'lh-lg'
  };

  // Optimizar clases con useMemo
  const baseClasses = useMemo(() => {
    const classes = [
      variant === 'h1' && 'display-4',
      variant === 'h2' && 'display-5',
      variant === 'h3' && 'display-6',
      size && sizeClasses[size],
      weight && weightClasses[weight],
      color && colorClasses[color],
      align && alignClasses[align],
      transform && transformClasses[transform],
      decoration && decorationClasses[decoration],
      lineHeight && lineHeightClasses[lineHeight],
      truncate && 'text-truncate',
      className
    ];
    return classes.filter(Boolean).join(' ');
  }, [variant, size, weight, color, align, transform, decoration, lineHeight, truncate, className]);

  // Memoizar componente para evitar recreaciones
  const Component = useMemo(() => variantTags[variant] || 'p', [variant]);

  return (
    <Component 
      className={baseClasses}
      {...props}
    >
      {children}
    </Component>
  );
};

Typography.propTypes = {
  /** Elemento HTML a renderizar */
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small', 'strong', 'em', 'code', 'pre']),
  /** Tamaño del texto: xs=muy pequeño, sm=pequeño, md=mediano, lg=grande, xl=muy grande, 2xl=enorme, 3xl=gigante */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  /** Peso de la fuente (grosor) */
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900, 'light', 'normal', 'medium', 'semibold', 'bold']),
  /** Color del texto */
  color: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'muted', 'white', 'body', 'body-emphasis', 'body-secondary', 'body-tertiary'
  ]),
  /** Alineación del texto */
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  /** Transformación de texto */
  transform: PropTypes.oneOf(['uppercase', 'lowercase', 'capitalize']),
  /** Decoración del texto */
  decoration: PropTypes.oneOf(['underline', 'line-through', 'none']),
  /** Altura de línea */
  lineHeight: PropTypes.oneOf([1, 'sm', 'base', 'lg']),
  /** Si el texto debe truncarse con puntos suspensivos */
  truncate: PropTypes.bool,
  /** Clases CSS adicionales */
  className: PropTypes.string,
  /** Contenido del elemento */
  children: PropTypes.node
};

// Optimizar con React.memo
const MemoizedTypography = React.memo(Typography, (prevProps, nextProps) => {
  // Comparación optimizada para Typography
  const criticalProps = [
    'variant', 'size', 'weight', 'color', 'align', 'transform',
    'decoration', 'lineHeight', 'truncate', 'children', 'className'
  ];
  
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});

MemoizedTypography.displayName = 'Typography';
export default MemoizedTypography;