import { useState, useEffect } from 'react';

/**
 * Configuración por defecto de breakpoints responsivos
 */
export const DEFAULT_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

/**
 * Configuración por defecto de vistas
 */
export const DEFAULT_VIEWS = {
  mobile: 'cards',
  tablet: 'table', 
  desktop: 'table'
};

/**
 * Hook genérico para manejo responsivo
 * @param {Object} options - Configuración personalizada
 * @param {Object} options.breakpoints - Puntos de quiebre personalizados
 * @param {Object} options.defaultViews - Vistas por defecto personalizadas
 * @param {Object} options.viewToggle - Configuración de botones de vista
 * @returns {Object} Información del dispositivo actual y configuraciones
 */
export const useResponsive = (options = {}) => {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    defaultViews = DEFAULT_VIEWS,
    viewToggle = {
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    }
  } = options;

  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (width < breakpoints.tablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Ejecutar al cargar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  // Obtener vista por defecto según dispositivo
  const getDefaultViewMode = () => {
    return defaultViews[deviceType] || 'table';
  };

  // Verificar si mostrar botones de cambio de vista
  const shouldShowViewToggle = () => {
    switch (deviceType) {
      case 'mobile':
        return viewToggle.showOnMobile;
      case 'tablet':
        return viewToggle.showOnTablet;
      case 'desktop':
        return viewToggle.showOnDesktop;
      default:
        return true;
    }
  };

  // Generar media queries CSS
  const getMediaQueries = () => ({
    mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
    tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
    desktop: `@media (min-width: ${breakpoints.tablet}px)`
  });

  return {
    deviceType,
    breakpoints,
    defaultViews,
    viewToggle,
    getDefaultViewMode,
    shouldShowViewToggle,
    getMediaQueries,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet', 
    isDesktop: deviceType === 'desktop'
  };
};