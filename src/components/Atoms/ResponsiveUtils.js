/**
 * Utilidades responsivas para componentes Atoms
 * 
 * Proporciona funciones y hooks para manejo de breakpoints,
 * clases responsivas y optimizaciones de rendimiento en diferentes dispositivos
 */

import React, { useMemo } from 'react';

// Breakpoints estándar (siguiendo Bootstrap 5)
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768, 
  lg: 992,
  xl: 1200,
  xxl: 1400
};

// Generar clases responsivas dinámicamente
export const generateResponsiveClasses = (baseClass, sizes, breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']) => {
  return breakpoints.reduce((acc, breakpoint) => {
    if (sizes[breakpoint]) {
      const prefix = breakpoint === 'xs' ? '' : `${breakpoint}-`;
      acc.push(`${baseClass}-${prefix}${sizes[breakpoint]}`);
    }
    return acc;
  }, []);
};

// Hook para detectar tamaño de pantalla (optimizado con useMemo)
export const useScreenSize = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'lg'; // SSR fallback
    
    const width = window.innerWidth;
    
    if (width < BREAKPOINTS.sm) return 'xs';
    if (width < BREAKPOINTS.md) return 'sm';
    if (width < BREAKPOINTS.lg) return 'md';
    if (width < BREAKPOINTS.xl) return 'lg';
    if (width < BREAKPOINTS.xxl) return 'xl';
    return 'xxl';
  }, []);
};

// Hook personalizado para crear props responsivas
export const useResponsiveProps = (props, defaultProps = {}) => {
  const screenSize = useScreenSize();
  
  return useMemo(() => {
    // Fusionar props por prioridad: específico del breakpoint > default
    return Object.keys(defaultProps).reduce((acc, key) => {
      // Buscar prop específico para el breakpoint actual
      const responsiveKey = `${key}-${screenSize}`;
      
      if (props[responsiveKey] !== undefined) {
        acc[key] = props[responsiveKey];
      } else if (props[key] !== undefined) {
        acc[key] = props[key];
      } else {
        acc[key] = defaultProps[key];
      }
      
      return acc;
    }, {});
  }, [props, defaultProps, screenSize]);
};

// Clases de utilidad responsiva comunes
export const RESPONSIVE_UTILITIES = {
  // Espaciado responsivo
  spacing: {
    xs: { padding: '0.25rem', margin: '0.25rem' },
    sm: { padding: '0.5rem', margin: '0.5rem' },
    md: { padding: '0.75rem', margin: '0.75rem' },
    lg: { padding: '1rem', margin: '1rem' },
    xl: { padding: '1.25rem', margin: '1.25rem' }
  },
  
  // Tipografía responsiva
  typography: {
    xs: { fontSize: '0.75rem', lineHeight: '1.2' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25' },
    md: { fontSize: '1rem', lineHeight: '1.5' },
    lg: { fontSize: '1.125rem', lineHeight: '1.5' },
    xl: { fontSize: '1.25rem', lineHeight: '1.6' }
  },
  
  // Componentes responsivos
  button: {
    xs: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.25rem', fontSize: '1.125rem' },
    xl: { padding: '1rem 1.5rem', fontSize: '1.25rem' }
  }
};

// Función para optimizar componentes en dispositivos móviles
export const optimizeForMobile = (Component) => {
  return React.memo(Component, (prevProps, nextProps) => {
    // No podemos usar hooks dentro de React.memo, usar approach diferente
    const isMobile = typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.md;
    
    if (isMobile) {
      // Comparación superficial optimizada para móviles
      const criticalProps = ['variant', 'size', 'disabled', 'children'];
      return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
    }
    
    // Comparación completa para desktop
    return Object.keys(prevProps).every(key => prevProps[key] === nextProps[key]);
  });
};

// Utilidad para lazy loading de imágenes en avatares
export const useLazyImage = (src, fallback) => {
  return useMemo(() => {
    if (!src) return fallback;
    
    // Optimización: precargar imagen solo si es crítica
    const img = new Image();
    img.src = src;
    
    return src;
  }, [src, fallback]);
};

export default {
  BREAKPOINTS,
  generateResponsiveClasses,
  useScreenSize,
  useResponsiveProps,
  RESPONSIVE_UTILITIES,
  optimizeForMobile,
  useLazyImage
};